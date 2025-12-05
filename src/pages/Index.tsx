import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Privilege {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  gradient: string;
  popular?: boolean;
}

interface Purchase {
  id: string;
  privilegeName: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired';
}

const privileges: Privilege[] = [
  {
    id: 'vip',
    name: 'VIP',
    price: 299,
    duration: '30 дней',
    gradient: 'gradient-purple-blue',
    features: [
      'Уникальный префикс [VIP]',
      'Доступ к VIP зоне',
      '3 дома на сервере',
      'Приоритет в очереди',
      '/fly на 1 час в день'
    ]
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 599,
    duration: '30 дней',
    gradient: 'gradient-purple-pink',
    popular: true,
    features: [
      'Уникальный префикс [PREMIUM]',
      'Доступ к PREMIUM зоне',
      '5 домов на сервере',
      'Приоритетный вход',
      '/fly без ограничений',
      'Набор редких ресурсов',
      'Уникальная броня'
    ]
  },
  {
    id: 'ultimate',
    name: 'ULTIMATE',
    price: 999,
    duration: '30 дней',
    gradient: 'gradient-blue-cyan',
    features: [
      'Эксклюзивный префикс [ULTIMATE]',
      'Доступ ко всем зонам',
      '10 домов на сервере',
      'Моментальный вход',
      '/fly, /god, /heal',
      'Набор легендарных предметов',
      'Эксклюзивное оружие',
      'Личный приват 500x500'
    ]
  }
];

const mockPurchases: Purchase[] = [
  {
    id: '1',
    privilegeName: 'VIP',
    purchaseDate: '2024-11-05',
    expiryDate: '2024-12-05',
    status: 'active'
  },
  {
    id: '2',
    privilegeName: 'PREMIUM',
    purchaseDate: '2024-10-01',
    expiryDate: '2024-10-31',
    status: 'expired'
  }
];

export default function Index() {
  const [selectedTab, setSelectedTab] = useState('shop');
  const [purchases] = useState<Purchase[]>(mockPurchases);

  const handleBuy = (privilege: Privilege) => {
    alert(`Покупка ${privilege.name} за ${privilege.price}₽ будет доступна после подключения платежной системы`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-purple-blue flex items-center justify-center">
                <Icon name="Swords" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">EndpvpCraft</h1>
                <p className="text-sm text-muted-foreground">Магазин привилегий</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-card">
                <Icon name="Users" size={18} className="text-primary" />
                <span className="text-sm">Онлайн: <span className="font-semibold text-primary">248</span></span>
              </div>
              <Button variant="outline" className="gap-2">
                <Icon name="User" size={18} />
                <span className="hidden sm:inline">Профиль</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="shop" className="gap-2">
              <Icon name="ShoppingBag" size={18} />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Icon name="UserCircle" size={18} />
              Личный кабинет
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shop" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Выбери свою привилегию
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Получи уникальные возможности и преимущества на сервере EndpvpCraft
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {privileges.map((privilege) => (
                <Card 
                  key={privilege.id} 
                  className={`relative overflow-hidden transition-all hover:scale-105 ${privilege.popular ? 'border-primary shadow-2xl shadow-primary/20' : ''}`}
                >
                  {privilege.popular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="gradient-purple-pink text-white border-0">
                        <Icon name="Star" size={14} className="mr-1" />
                        Популярное
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="space-y-4">
                    <div className={`w-16 h-16 rounded-xl ${privilege.gradient} flex items-center justify-center mx-auto`}>
                      <Icon name="Crown" size={32} className="text-white" />
                    </div>
                    <div className="text-center">
                      <CardTitle className="text-3xl mb-2">{privilege.name}</CardTitle>
                      <CardDescription className="text-base">{privilege.duration}</CardDescription>
                    </div>
                    <div className="text-center">
                      <span className="text-5xl font-bold">{privilege.price}</span>
                      <span className="text-2xl text-muted-foreground ml-1">₽</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {privilege.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Icon name="Check" size={20} className="text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className={`w-full ${privilege.gradient} text-white border-0 hover:opacity-90 transition-opacity`}
                      size="lg"
                      onClick={() => handleBuy(privilege)}
                    >
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      Купить
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Личный кабинет</h2>
              <p className="text-muted-foreground text-lg">
                Управляй своими привилегиями и отслеживай покупки
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="gradient-purple-blue p-1">
                <div className="bg-background rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full gradient-purple-pink flex items-center justify-center">
                      <Icon name="User" size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">Steve_Player</h3>
                      <p className="text-muted-foreground">ID: 12345</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Settings" size={18} />
                      Настройки
                    </Button>
                  </div>
                </div>
              </Card>

              <div>
                <h3 className="text-2xl font-bold mb-4">Активные привилегии</h3>
                {purchases.filter(p => p.status === 'active').length > 0 ? (
                  <div className="grid gap-4">
                    {purchases.filter(p => p.status === 'active').map((purchase) => (
                      <Card key={purchase.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg gradient-purple-blue flex items-center justify-center">
                                <Icon name="Crown" size={24} className="text-white" />
                              </div>
                              <div>
                                <CardTitle>{purchase.privilegeName}</CardTitle>
                                <CardDescription>
                                  Активна до {new Date(purchase.expiryDate).toLocaleDateString('ru-RU')}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant="default" className="gradient-purple-blue text-white border-0">
                              <Icon name="CheckCircle" size={14} className="mr-1" />
                              Активна
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Icon name="Package" size={48} className="text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">У вас пока нет активных привилегий</p>
                      <Button 
                        className="mt-4 gradient-purple-blue text-white border-0"
                        onClick={() => setSelectedTab('shop')}
                      >
                        Перейти в магазин
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">История покупок</h3>
                <div className="grid gap-4">
                  {purchases.map((purchase) => (
                    <Card key={purchase.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg ${purchase.status === 'active' ? 'gradient-purple-blue' : 'bg-muted'} flex items-center justify-center`}>
                              <Icon name={purchase.status === 'active' ? 'Crown' : 'Clock'} size={24} className="text-white" />
                            </div>
                            <div>
                              <CardTitle>{purchase.privilegeName}</CardTitle>
                              <CardDescription>
                                Куплена: {new Date(purchase.purchaseDate).toLocaleDateString('ru-RU')}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant={purchase.status === 'active' ? 'default' : 'secondary'}
                            className={purchase.status === 'active' ? 'gradient-purple-blue text-white border-0' : ''}
                          >
                            {purchase.status === 'active' ? 'Активна' : 'Истекла'}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="Swords" size={20} className="text-primary" />
                EndpvpCraft
              </h4>
              <p className="text-sm text-muted-foreground">
                Лучший PvP сервер Minecraft с уникальными возможностями
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  support@endpvpcraft.ru
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  Discord: EndpvpCraft
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3">IP сервера</h4>
              <div className="px-4 py-2 rounded-lg bg-card border border-border font-mono text-sm">
                play.endpvpcraft.ru
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 EndpvpCraft. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
