namespace Audi.Services.Mailer
{
    public class EmailConfiguration : IEmailConfiguration
    {
        public string DefaultOutboundName { get; set; }
        public string DefaultOutboundMailbox { get; set; }
        
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string SecureSocketOptions { get; set; }
        
        public string PopServer { get; set; }
        public int PopPort { get; set; }
        public string PopUsername { get; set; }
        public string PopPassword { get; set; }
        public string PopSecureSocketOptions { get; set; }

        public bool Authorize { get; set; }
        public bool ActuallySend { get; set; }
    }
}