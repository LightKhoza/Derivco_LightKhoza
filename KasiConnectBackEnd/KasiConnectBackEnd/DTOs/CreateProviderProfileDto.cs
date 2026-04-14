namespace KasiConnectBackEnd.DTOs
{
    public class CreateProviderProfileDto
    {
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal HourlyRate { get; set; }

        public List<int> ServiceIds { get; set; } = new();
    }
}
