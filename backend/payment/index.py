import json
import os
import uuid
from typing import Dict, Any
import requests
import base64

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Обрабатывает создание платежей через ЮKassa API
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        shop_id = os.environ.get('YOOKASSA_SHOP_ID')
        secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
        
        if not shop_id or not secret_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Payment credentials not configured'}),
                'isBase64Encoded': False
            }
        
        body_data = json.loads(event.get('body', '{}'))
        privilege_name = body_data.get('privilegeName', '')
        price = body_data.get('price', 0)
        user_email = body_data.get('email', '')
        
        if not privilege_name or not price:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid request data'}),
                'isBase64Encoded': False
            }
        
        idempotence_key = str(uuid.uuid4())
        
        payment_data = {
            'amount': {
                'value': f'{price:.2f}',
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': 'https://your-domain.com/?payment=success'
            },
            'capture': True,
            'description': f'Покупка привилегии {privilege_name} на EndpvpCraft'
        }
        
        if user_email:
            payment_data['receipt'] = {
                'customer': {
                    'email': user_email
                },
                'items': [{
                    'description': f'Привилегия {privilege_name}',
                    'quantity': '1',
                    'amount': {
                        'value': f'{price:.2f}',
                        'currency': 'RUB'
                    },
                    'vat_code': 1
                }]
            }
        
        auth_string = f'{shop_id}:{secret_key}'
        auth_bytes = auth_string.encode('utf-8')
        auth_b64 = base64.b64encode(auth_bytes).decode('utf-8')
        
        headers = {
            'Authorization': f'Basic {auth_b64}',
            'Idempotence-Key': idempotence_key,
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            'https://api.yookassa.ru/v3/payments',
            json=payment_data,
            headers=headers,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            result = response.json()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'paymentId': result.get('id'),
                    'confirmationUrl': result.get('confirmation', {}).get('confirmation_url'),
                    'status': result.get('status')
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Payment creation failed', 'details': response.text}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
