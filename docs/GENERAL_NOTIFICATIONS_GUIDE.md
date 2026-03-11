# Guia de Notificações Gerais - SomaAI

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tipos de Notificações](#tipos-de-notificações)
4. [Canais de Notificação](#canais-de-notificação)
5. [Implementação Backend](#implementação-backend)
6. [Implementação Frontend](#implementação-frontend)
7. [Exemplos de Uso](#exemplos-de-uso)
8. [Configuração](#configuração)

---

## Visão Geral

O sistema de notificações do SomaAI permite enviar mensagens aos usuários através de múltiplos canais:

- **Push Notifications**: Notificações em tempo real no app
- **Email**: Notificações por email com templates HTML
- **SMS**: Notificações por SMS (Twilio)
- **WhatsApp**: Notificações via WhatsApp (premium)

**Localização**: `src/shared/providers/notifications/`

---

## Arquitetura

### Estrutura de Arquivos

```
src/shared/providers/notifications/
├── index.ts                      # Exports
├── notification.module.ts        # Módulo NestJS
├── notification.service.ts       # Serviço principal
└── notification.service.spec.ts  # Testes
```

### Dependências

```typescript
// notification.module.ts
@Module({
  imports: [ConfigModule, EmailModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
```

---

## Tipos de Notificações

### Interface NotificationData

```typescript
export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: 
    | 'plan_expiring'      // Plano expirando
    | 'plan_expired'       // Plano expirado
    | 'plan_renewed'       // Plano renovado
    | 'payment_failed'     // Pagamento falhou
    | 'upgrade_offer'      // Oferta de upgrade
    | 'campaign';          // Campanha
  data?: any;              // Dados adicionais
}
```

### 1. Notificações de Plano

#### 1.1 Plano Expirando
```typescript
{
  userId: 'user-uuid',
  title: '⏰ Seu plano expira em 7 dias',
  message: 'Olá João! Renove sua assinatura para continuar usando todos os recursos.',
  type: 'plan_expiring',
  data: {
    planId: 'plan-uuid',
    expiresAt: '2026-03-20',
    daysRemaining: 7
  }
}
```

**Quando**: 7 dias antes da expiração (job agendado)
**Canais**: Push + Email
**Ação**: Link para renovar plano

#### 1.2 Plano Expirado
```typescript
{
  userId: 'user-uuid',
  title: '❌ Seu plano expirou',
  message: 'Olá João! Sua assinatura foi cancelada. Reative para continuar.',
  type: 'plan_expired',
  data: {
    planId: 'plan-uuid',
    expiredAt: '2026-03-13'
  }
}
```

**Quando**: No dia da expiração
**Canais**: Push + Email + SMS (crítico)
**Ação**: Link para reativar plano

#### 1.3 Plano Renovado
```typescript
{
  userId: 'user-uuid',
  title: '✅ Plano renovado com sucesso!',
  message: 'Olá João! Obrigado por renovar. Seu plano está ativo.',
  type: 'plan_renewed',
  data: {
    planId: 'plan-uuid',
    renewedAt: '2026-03-13',
    expiresAt: '2027-03-13'
  }
}
```

**Quando**: Após renovação bem-sucedida
**Canais**: Push + Email
**Ação**: Nenhuma (confirmação)


#### 1.4 Oferta de Upgrade
```typescript
{
  userId: 'user-uuid',
  title: '💡 Descubra o poder do Premium!',
  message: 'Olá João! Desbloqueie recursos exclusivos com upgrade para Premium.',
  type: 'upgrade_offer',
  data: {
    currentPlan: 'free',
    targetPlan: 'premium',
    discount: 20
  }
}
```

**Quando**: Após 30 dias de uso (free users)
**Canais**: Push + Email
**Ação**: Link para fazer upgrade

### 2. Notificações de Pagamento

#### 2.1 Pagamento Falhou
```typescript
{
  userId: 'user-uuid',
  title: '💳 Falha no pagamento',
  message: 'Olá João! Não conseguimos processar seu pagamento. Atualize os dados.',
  type: 'payment_failed',
  data: {
    subscriptionId: 'sub-uuid',
    reason: 'card_declined',
    retryDate: '2026-03-15'
  }
}
```

**Quando**: Falha na cobrança
**Canais**: Push + Email + SMS (crítico)
**Ação**: Link para atualizar pagamento

### 3. Notificações de Campanha

#### 3.1 Campanha Geral
```typescript
{
  userId: 'user-uuid',
  title: '🎉 Promoção especial!',
  message: 'Olá João! Aproveite 50% de desconto em planos anuais.',
  type: 'campaign',
  data: {
    campaignId: 'campaign-uuid',
    discount: 50,
    validUntil: '2026-03-31'
  }
}
```

**Quando**: Conforme agendado
**Canais**: Push + Email
**Ação**: Link para oferta

---

## Canais de Notificação

### 1. Push Notifications

**Implementação**: Firebase Cloud Messaging (FCM) / Apple Push Notification (APNS)

```typescript
async sendPushNotification(notification: NotificationData): Promise<boolean> {
  try {
    this.logger.log(`📱 Enviando notificação push para usuário ${notification.userId}`);
    
    // TODO: Implementar integração com Firebase Cloud Messaging (FCM)
    // ou outro serviço de push notifications
    
    // Por enquanto, apenas log
    this.logger.log(`Push Notification: ${notification.title} - ${notification.message}`);
    
    return true;
  } catch (error) {
    this.logger.error(`Erro ao enviar push notification: ${error.message}`);
    return false;
  }
}
```

**Status**: ⏳ TODO - Implementar FCM/APNS

### 2. Email

**Implementação**: EmailService (já implementado)

```typescript
async sendEmailNotification(
  email: string, 
  notification: NotificationData
): Promise<boolean> {
  try {
    this.logger.log(`📧 Enviando email para ${email}`);
    
    const emailType = this.getEmailTypeFromNotification(notification.type);
    const userName = this.extractUserNameFromNotification(notification);
    
    const success = await this.emailService.sendPlanNotificationEmail(
      email,
      userName,
      notification.title,
      notification.message,
      emailType
    );
    
    if (success) {
      this.logger.log(`✅ Email enviado com sucesso para ${email}`);
    } else {
      this.logger.error(`❌ Falha ao enviar email para ${email}`);
    }
    
    return success;
  } catch (error) {
    this.logger.error(`❌ Erro ao enviar email: ${error.message}`);
    return false;
  }
}
```

**Status**: ✅ Implementado

### 3. SMS

**Implementação**: Twilio SMS API

```typescript
async sendSmsNotification(
  phoneNumber: string,
  notification: NotificationData
): Promise<boolean> {
  try {
    this.logger.log(`📱 Enviando SMS para ${phoneNumber}`);
    
    // TODO: Implementar integração com Twilio SMS
    
    const message = this.getSmsTemplate(notification);
    
    // Por enquanto, apenas log
    this.logger.log(`SMS enviado: ${message}`);
    
    return true;
  } catch (error) {
    this.logger.error(`Erro ao enviar SMS: ${error.message}`);
    return false;
  }
}
```

**Status**: ⏳ TODO - Implementar Twilio SMS

### 4. WhatsApp

**Implementação**: WhatsApp Business API / Twilio WhatsApp

```typescript
async sendWhatsAppNotification(
  phoneNumber: string,
  notification: NotificationData
): Promise<boolean> {
  try {
    this.logger.log(`📱 Enviando WhatsApp para ${phoneNumber}`);
    
    // TODO: Implementar integração com WhatsApp Business API
    // ou Twilio WhatsApp API
    
    const message = this.getWhatsAppTemplate(notification);
    
    // Por enquanto, apenas log
    this.logger.log(`WhatsApp enviado: ${message}`);
    
    return true;
  } catch (error) {
    this.logger.error(`Erro ao enviar WhatsApp: ${error.message}`);
    return false;
  }
}
```

**Status**: ⏳ TODO - Implementar WhatsApp Business API

---

## Implementação Backend

### 1. Injetar NotificationService

```typescript
import { NotificationService } from '@shared/providers/notifications';

@Injectable()
export class MyService {
  constructor(
    private notificationService: NotificationService
  ) {}
}
```

### 2. Enviar Notificação Push

```typescript
async notifyUser(userId: string) {
  await this.notificationService.sendPushNotification({
    userId,
    title: '🎉 Bem-vindo!',
    message: 'Olá João! Bem-vindo ao SomaAI.',
    type: 'campaign',
    data: {
      action: 'open_home'
    }
  });
}
```

### 3. Enviar Notificação por Email

```typescript
async notifyUserEmail(email: string, userId: string) {
  await this.notificationService.sendEmailNotification(email, {
    userId,
    title: 'Seu plano expira em 7 dias',
    message: 'Olá João! Renove sua assinatura para continuar.',
    type: 'plan_expiring',
    data: {
      daysRemaining: 7
    }
  });
}
```

### 4. Enviar Múltiplos Canais

```typescript
async notifyUserMultiChannel(user: User) {
  const notification: NotificationData = {
    userId: user.id,
    title: '❌ Seu plano expirou',
    message: `Olá ${user.name}! Reative sua assinatura agora.`,
    type: 'plan_expired',
    data: {
      expiredAt: new Date()
    }
  };
  
  // Enviar em paralelo
  await Promise.all([
    this.notificationService.sendPushNotification(notification),
    this.notificationService.sendEmailNotification(user.email, notification),
    // SMS para casos críticos
    this.smsService.sendSms(user.phone, notification.message)
  ]);
}
```


### 5. Jobs Agendados (Cron)

```typescript
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationScheduler {
  constructor(
    private notificationService: NotificationService,
    private userRepository: Repository<User>
  ) {}

  /**
   * Verifica planos expirando diariamente às 08:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkExpiringPlans(): Promise<void> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const users = await this.userRepository.find({
      where: {
        subscription: {
          expiresAt: LessThan(sevenDaysFromNow)
        }
      },
      relations: ['subscription']
    });

    for (const user of users) {
      await this.notificationService.sendPushNotification({
        userId: user.id,
        title: `⏰ Seu plano expira em 7 dias`,
        message: `Olá ${user.name}! Renove sua assinatura para continuar.`,
        type: 'plan_expiring',
        data: {
          daysRemaining: 7,
          expiresAt: user.subscription.expiresAt
        }
      });
    }
  }

  /**
   * Verifica planos expirados diariamente às 09:00
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpiredPlans(): Promise<void> {
    const users = await this.userRepository.find({
      where: {
        subscription: {
          expiresAt: LessThan(new Date()),
          status: 'active'
        }
      },
      relations: ['subscription']
    });

    for (const user of users) {
      // Enviar em múltiplos canais para casos críticos
      await Promise.all([
        this.notificationService.sendPushNotification({
          userId: user.id,
          title: '❌ Seu plano expirou',
          message: `Olá ${user.name}! Reative sua assinatura agora.`,
          type: 'plan_expired',
          data: {
            expiredAt: user.subscription.expiresAt
          }
        }),
        this.notificationService.sendEmailNotification(user.email, {
          userId: user.id,
          title: '❌ Seu plano expirou',
          message: `Olá ${user.name}! Reative sua assinatura agora.`,
          type: 'plan_expired',
          data: {
            expiredAt: user.subscription.expiresAt
          }
        })
      ]);
    }
  }
}
```

---

## Implementação Frontend

### 1. Receber Push Notifications

```typescript
// service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: '/logo.png',
    badge: '/badge.png',
    tag: data.type,
    data: data.data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data;
  
  // Navegar para a página apropriada
  if (data.action === 'open_subscriptions') {
    clients.openWindow('/subscriptions');
  } else if (data.action === 'open_payment') {
    clients.openWindow('/payment');
  }
});
```

### 2. Registrar Service Worker

```typescript
// main.ts ou app.component.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registrado:', registration);
      
      // Solicitar permissão para push notifications
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    })
    .catch(error => {
      console.error('Erro ao registrar Service Worker:', error);
    });
}
```

### 3. Componente de Notificações

```typescript
import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notifications"
        [ngClass]="'notification-' + notification.type"
        class="notification"
      >
        <div class="notification-header">
          <h4>{{ notification.title }}</h4>
          <button (click)="closeNotification(notification.id)">×</button>
        </div>
        <p>{{ notification.message }}</p>
        <div class="notification-actions" *ngIf="notification.action">
          <button (click)="handleAction(notification.action)">
            {{ notification.actionLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 400px;
    }
    
    .notification {
      background: white;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    }
    
    .notification-plan_expiring {
      border-left: 4px solid #ffc107;
    }
    
    .notification-plan_expired {
      border-left: 4px solid #dc3545;
    }
    
    .notification-plan_renewed {
      border-left: 4px solid #28a745;
    }
    
    .notification-payment_failed {
      border-left: 4px solid #dc3545;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notification => {
      this.notifications.push({
        ...notification,
        id: Math.random()
      });
      
      // Auto-remover após 5 segundos
      setTimeout(() => {
        this.closeNotification(notification.id);
      }, 5000);
    });
  }

  closeNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  handleAction(action: string) {
    // Navegar ou executar ação
    if (action === 'renew_plan') {
      // Navegar para renovação
    }
  }
}
```

### 4. Serviço de Notificações (Frontend)

```typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<any>();
  public notifications$ = this.notificationSubject.asObservable();

  showNotification(notification: any) {
    this.notificationSubject.next(notification);
  }

  showSuccess(title: string, message: string) {
    this.showNotification({
      type: 'success',
      title,
      message
    });
  }

  showError(title: string, message: string) {
    this.showNotification({
      type: 'error',
      title,
      message
    });
  }

  showWarning(title: string, message: string) {
    this.showNotification({
      type: 'warning',
      title,
      message
    });
  }

  showInfo(title: string, message: string) {
    this.showNotification({
      type: 'info',
      title,
      message
    });
  }
}
```


---

## Exemplos de Uso

### Exemplo 1: Notificar após Renovação de Plano

```typescript
// subscriptions.service.ts
async renewSubscription(userId: string, planId: string) {
  // Renovar plano
  const subscription = await this.subscriptionRepository.save({
    userId,
    planId,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  });

  // Buscar usuário
  const user = await this.userRepository.findOne({ where: { id: userId } });

  // Notificar
  await this.notificationService.sendPushNotification({
    userId,
    title: '✅ Plano renovado com sucesso!',
    message: `Olá ${user.name}! Obrigado por renovar. Seu plano está ativo.`,
    type: 'plan_renewed',
    data: {
      planId,
      renewedAt: new Date(),
      expiresAt: subscription.expiresAt
    }
  });

  // Enviar email também
  await this.notificationService.sendEmailNotification(user.email, {
    userId,
    title: '✅ Plano renovado com sucesso!',
    message: `Olá ${user.name}! Obrigado por renovar. Seu plano está ativo.`,
    type: 'plan_renewed',
    data: {
      planId,
      renewedAt: new Date(),
      expiresAt: subscription.expiresAt
    }
  });

  return subscription;
}
```

### Exemplo 2: Notificar Falha de Pagamento

```typescript
// payment.service.ts
async handlePaymentFailure(userId: string, subscriptionId: string, reason: string) {
  const user = await this.userRepository.findOne({ where: { id: userId } });

  // Notificar em múltiplos canais
  await Promise.all([
    this.notificationService.sendPushNotification({
      userId,
      title: '💳 Falha no pagamento',
      message: `Olá ${user.name}! Não conseguimos processar seu pagamento. Atualize os dados.`,
      type: 'payment_failed',
      data: {
        subscriptionId,
        reason,
        retryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    }),
    this.notificationService.sendEmailNotification(user.email, {
      userId,
      title: '💳 Falha no pagamento',
      message: `Olá ${user.name}! Não conseguimos processar seu pagamento. Atualize os dados.`,
      type: 'payment_failed',
      data: {
        subscriptionId,
        reason,
        retryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    })
  ]);
}
```

### Exemplo 3: Campanha de Marketing

```typescript
// campaign.service.ts
async sendCampaign(campaignId: string, userIds: string[]) {
  const campaign = await this.campaignRepository.findOne({ where: { id: campaignId } });

  for (const userId of userIds) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    await this.notificationService.sendPushNotification({
      userId,
      title: campaign.title,
      message: campaign.message,
      type: 'campaign',
      data: {
        campaignId,
        action: campaign.action,
        link: campaign.link
      }
    });
  }
}
```

---

## Configuração

### Variáveis de Ambiente

```env
# Notificações
NOTIFICATION_ENABLED=true
NOTIFICATION_SERVICE=fcm

# Firebase Cloud Messaging
FCM_PROJECT_ID=seu-projeto-id
FCM_PRIVATE_KEY=sua-chave-privada
FCM_CLIENT_EMAIL=seu-email@firebase.iam.gserviceaccount.com

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# Email
EMAIL_FROM=noreply@somaai.com
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=seu-email@gmail.com
EMAIL_SMTP_PASSWORD=sua-senha

# App
APP_URL=https://somaai.app
```

### Configuração do Módulo

```typescript
// app.module.ts
import { NotificationModule } from '@shared/providers/notifications';

@Module({
  imports: [
    // ... outros módulos
    NotificationModule
  ]
})
export class AppModule {}
```

---

## Status de Implementação

| Canal | Status | Prioridade |
|-------|--------|-----------|
| Push Notifications (FCM) | ⏳ TODO | Alta |
| Email | ✅ Implementado | Alta |
| SMS (Twilio) | ⏳ TODO | Média |
| WhatsApp | ⏳ TODO | Média |

---

## Próximos Passos

1. **Implementar FCM**: Integrar Firebase Cloud Messaging para push notifications
2. **Implementar Twilio SMS**: Adicionar suporte a SMS
3. **Implementar WhatsApp**: Integrar WhatsApp Business API
4. **Dashboard de Notificações**: Criar painel para gerenciar notificações
5. **Preferências de Notificação**: Permitir usuários escolher canais
6. **Analytics**: Rastrear taxa de abertura e cliques

---

## Referências

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [NestJS Schedule](https://docs.nestjs.com/techniques/task-scheduling)

---

**Última atualização**: Março 2026
**Versão**: 1.0.0
