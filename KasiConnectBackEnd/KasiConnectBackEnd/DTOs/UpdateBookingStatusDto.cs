using System.Text.Json.Serialization;

namespace KasiConnectBackEnd.DTOs
{
    public class UpdateBookingStatusDto
    {
        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;
    }
}
