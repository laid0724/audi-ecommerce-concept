namespace Audi.Services.Mailer
{
    // these are the config properties that you need to setup in your appsettings.json file if you want MailKit to work.
    public interface IEmailConfiguration
    {
        string DefaultOutboundName { get; } // Name of system email, e.g., Audi Customer Service
        string DefaultOutboundMailbox { get; } // Email we're sending through this app, e.g., service@audi.com.tw

        string SmtpServer { get; }
        int SmtpPort { get; }
        string SmtpUsername { get; set; }
        string SmtpPassword { get; set; }
        string SecureSocketOptions { get; set; } // None | Auto | SslOnConnect | StartTls | StartTlsWhenAvailable

        string PopServer { get; }
        int PopPort { get; }
        string PopUsername { get; }
        string PopPassword { get; }
        string PopSecureSocketOptions { get; set; }
        
        bool Authorize { get; set; }
        bool ActuallySend { get; set; } 
    }
}