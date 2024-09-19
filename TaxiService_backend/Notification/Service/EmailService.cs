using Microsoft.Extensions.Options;
using NETCore.MailKit.Infrastructure.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;
using System.Net;
using System.Net.Mime;
using Notification.Interface;
using System.Net.Mail;
using PostmarkDotNet;

namespace Notification.Service
{
    public class EmailService : IEmailService
    {
        private readonly IOptions<EmailStrukture> _emailConfiguration;

        public EmailService(IOptions<EmailStrukture> emailConfiguration)
        {
            this._emailConfiguration = emailConfiguration;
        }

        public async Task<bool> SendMailAsync(EmailData emailData)
        {
            try
            {
                string postmarkServerToken = "1091deca-5f5b-46fa-92e7-04b93cf6764e"; // Replace this with your Postmark server token
                string fromAddress = "vlatkovic.pr37.2020@uns.ac.rs"; // Change this to your email address

                var client = new PostmarkClient(postmarkServerToken);

                var message = new PostmarkMessage
                {
                    From = fromAddress,
                    To = emailData.Towho.ToString(),
                    Subject = emailData.Subject,
                    TextBody = emailData.Content,
                };

                var sendResult = await client.SendMessageAsync(message);

                if (sendResult.Status != PostmarkStatus.Success)
                {
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška prilikom slanja e-maila: {ex.Message}");
                return false;
            }

            return true;
        }
    }
}
 
