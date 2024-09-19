using Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Notification.Interface
{
    public interface IEmailService
    {
        Task<bool> SendMailAsync(EmailData emailData);
    }
    
        
}
