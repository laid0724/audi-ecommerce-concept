using System.Collections.Generic;
using System.Threading.Tasks;
using Audi.Models;
using MimeKit;

namespace Audi.Services.Mailer
{
    // see: https://dotnetcoretutorials.com/2017/11/02/using-mailkit-send-receive-email-asp-net-core/
    public interface IEmailService
    {
        List<EmailMessage> GetEmails(int? numberOfEmailToGet); // TODO: return this in paged format and turn this into an async function
        void Send(EmailMessage emailMessage);
        Task SendAsync(EmailMessage emailMessage);
        Task SendAsync(string email, string subject, string message);
    }
}
