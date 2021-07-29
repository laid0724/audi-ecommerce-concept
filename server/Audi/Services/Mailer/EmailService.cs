using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Audi.Models;
using MailKit;
using MailKit.Net.Pop3;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;

namespace Audi.Services.Mailer
{
    // see: https://dotnetcoretutorials.com/2017/11/02/using-mailkit-send-receive-email-asp-net-core/
    public class EmailService : IEmailService
    {
        private readonly IEmailConfiguration _emailConfiguration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IEmailConfiguration emailConfiguration, ILogger<EmailService> logger)
        {
            _emailConfiguration = emailConfiguration ?? throw new ArgumentNullException(nameof(emailConfiguration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public List<EmailMessage> GetEmails(int? numberOfEmailToGet)
        // TODO: return this in paged format and turn this into an async function
        {
            using (var emailClient = new Pop3Client())
            {
                SecureSocketOptions socketOptions = GetSecureSocketOptions(_emailConfiguration.PopSecureSocketOptions);
                emailClient.Connect(_emailConfiguration.PopServer, _emailConfiguration.PopPort, socketOptions);

                // emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

                emailClient.Authenticate(_emailConfiguration.PopUsername, _emailConfiguration.PopPassword);

                List<EmailMessage> emails = new List<EmailMessage>();

                void AddEmailFromIndex(int index)
                {
                    var message = emailClient.GetMessage(index);

                    var emailMessage = new EmailMessage
                    {
                        Content = !string.IsNullOrEmpty(message.HtmlBody) ? message.HtmlBody : message.TextBody,
                        Subject = message.Subject
                    };

                    emailMessage.ToAddresses.AddRange(message.To.Select(x => (MailboxAddress)x).Select(x => new EmailAddress { Address = x.Address, Name = x.Name }));
                    emailMessage.FromAddresses.AddRange(message.From.Select(x => (MailboxAddress)x).Select(x => new EmailAddress { Address = x.Address, Name = x.Name }));

                    emails.Add(emailMessage);

                    // TODO: table for emails
                    // TODO: logic to write to db with datetime, then delete message

                    // write the message to a file
                    // message.WriteTo(string.Format("{0}.msg", i));

                    // mark the message for deletion
                    // emailClient.DeleteMessage(i);
                }

                if (numberOfEmailToGet.HasValue && numberOfEmailToGet.Value > 0)
                {
                    for (int i = 0; i < emailClient.Count && i < numberOfEmailToGet; i++)
                    {
                        AddEmailFromIndex(i);
                    }
                }
                else
                {
                    for (int i = 0; i < emailClient.Count; i++)
                    {
                        AddEmailFromIndex(i);
                    }
                }

                // if (emailClient.IsConnected)
                // {
                //     // if we do not disconnect cleanly, then the messages won't actually get deleted
                //     emailClient.Disconnect(true);
                // }

                return emails;
            }
        }

        public void Send(EmailMessage emailMessage)
        {
            if (!_emailConfiguration.ActuallySend)
            {
                return;
            }

            var message = new MimeMessage();

            message.To.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));
            message.From.AddRange(emailMessage.FromAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

            message.Subject = emailMessage.Subject;

            //We will say we are sending HTML. But there are options for plaintext etc. 
            message.Body = new TextPart(TextFormat.Html)
            {
                Text = emailMessage.Content
            };

            try
            {
                //Be careful that the SmtpClient class is the one from Mailkit not the framework!
                using (var emailClient = new SmtpClient())
                {
                    SecureSocketOptions socketOptions = GetSecureSocketOptions(_emailConfiguration.SecureSocketOptions);

                    //The last parameter here is to use SSL (Which you should!)
                    emailClient.Connect(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, socketOptions);

                    //Remove any OAuth functionality as we won't be using it. 
                    emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (_emailConfiguration.Authorize)
                    {
                        emailClient.Authenticate(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword);
                    }

                    emailClient.Send(message);

                    emailClient.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Send email failed with {Message}", ex.Message);
            }
        }

        public async Task SendAsync(EmailMessage emailMessage)
        {
            if (!_emailConfiguration.ActuallySend)
            {
                return;
            }

            var message = new MimeMessage();

            message.To.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));
            message.From.AddRange(emailMessage.FromAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

            message.Subject = emailMessage.Subject;

            message.Body = new TextPart(TextFormat.Html)
            {
                Text = emailMessage.Content
            };

            try
            {
                using (var emailClient = new SmtpClient())
                {
                    SecureSocketOptions socketOptions = GetSecureSocketOptions(_emailConfiguration.SecureSocketOptions);
                    await emailClient.ConnectAsync(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, socketOptions);

                    if (_emailConfiguration.Authorize)
                    {
                        await emailClient.AuthenticateAsync(new NetworkCredential(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword));
                    }

                    await emailClient.SendAsync(message);
                    await emailClient.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Send email failed with {Message}", ex.Message);
            }
        }

        public async Task SendAsync(string email, string subject, string emailMessage)
        {
            if (!_emailConfiguration.ActuallySend)
            {
                return;
            }

            try
            {
                var message = new MimeMessage();

                message.From.Add(new MailboxAddress(_emailConfiguration.DefaultOutboundName, _emailConfiguration.DefaultOutboundMailbox));
                message.To.Add(new MailboxAddress("", email));

                message.Subject = subject;
                message.Body = new TextPart(TextFormat.Html) { Text = emailMessage };

                using (var emailClient = new SmtpClient())
                {
                    SecureSocketOptions socketOptions = GetSecureSocketOptions(_emailConfiguration.SecureSocketOptions);

                    await emailClient.ConnectAsync(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort, socketOptions);

                    if (_emailConfiguration.Authorize)
                    {
                        await emailClient.AuthenticateAsync(new NetworkCredential(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword));
                    }

                    await emailClient.SendAsync(message);
                    await emailClient.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogDebug("Send email failed with {Message}", ex.Message);
            }
        }

        private SecureSocketOptions GetSecureSocketOptions(string option)
        {
            switch (option)
            {
                case "None":
                    return SecureSocketOptions.None;
                case "Auto":
                    return SecureSocketOptions.Auto;
                case "SslOnConnect":
                    return SecureSocketOptions.SslOnConnect;
                case "StartTls":
                    return SecureSocketOptions.StartTls;
                case "StartTlsWhenAvailable":
                    return SecureSocketOptions.StartTlsWhenAvailable;
                default:
                    throw new ArgumentOutOfRangeException(nameof(option), "unexpected appsettings.json for mail socket configuration");
            }
        }

    }
}