import json
import socket
import struct
from typing import Dict, Any, Tuple

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Получает статус Minecraft сервера (онлайн игроков)
    Args: event - dict с httpMethod, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict с информацией о сервере
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        server_host = 'EndpvpCraft.aternos.me'
        server_port = 49669
        
        try:
            players_online, max_players = get_server_status(server_host, server_port)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'online': players_online,
                    'max': max_players,
                    'status': 'online'
                }),
                'isBase64Encoded': False
            }
        except Exception as e:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'online': 0,
                    'max': 0,
                    'status': 'offline',
                    'error': str(e)
                }),
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


def get_server_status(host: str, port: int, timeout: float = 5.0) -> Tuple[int, int]:
    '''
    Получает статус Minecraft сервера через Server List Ping протокол
    Returns: (players_online, max_players)
    '''
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    
    try:
        sock.connect((host, port))
        
        handshake = create_handshake_packet(host, port)
        sock.sendall(handshake)
        
        status_request = b'\x01\x00'
        sock.sendall(status_request)
        
        response = receive_packet(sock)
        
        response_data = json.loads(response.decode('utf-8'))
        
        players_online = response_data.get('players', {}).get('online', 0)
        max_players = response_data.get('players', {}).get('max', 0)
        
        return players_online, max_players
        
    finally:
        sock.close()


def create_handshake_packet(host: str, port: int) -> bytes:
    '''Создаёт handshake пакет для Minecraft протокола'''
    protocol_version = 47
    next_state = 1
    
    host_bytes = host.encode('utf-8')
    host_length = len(host_bytes)
    
    data = b''
    data += pack_varint(0x00)
    data += pack_varint(protocol_version)
    data += pack_varint(host_length)
    data += host_bytes
    data += struct.pack('>H', port)
    data += pack_varint(next_state)
    
    return pack_varint(len(data)) + data


def receive_packet(sock: socket.socket) -> bytes:
    '''Получает пакет от Minecraft сервера'''
    length = unpack_varint(sock)
    packet_id = unpack_varint(sock)
    
    data_length = unpack_varint(sock)
    data = sock.recv(data_length)
    
    return data


def pack_varint(value: int) -> bytes:
    '''Упаковывает число в VarInt формат'''
    result = b''
    while True:
        temp = value & 0x7F
        value >>= 7
        if value != 0:
            temp |= 0x80
        result += struct.pack('B', temp)
        if value == 0:
            break
    return result


def unpack_varint(sock: socket.socket) -> int:
    '''Распаковывает VarInt из сокета'''
    result = 0
    for i in range(5):
        byte_data = sock.recv(1)
        if not byte_data:
            raise ConnectionError('Connection closed')
        byte = struct.unpack('B', byte_data)[0]
        result |= (byte & 0x7F) << (7 * i)
        if not byte & 0x80:
            break
    return result
