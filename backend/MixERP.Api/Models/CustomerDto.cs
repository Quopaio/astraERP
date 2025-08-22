namespace MixERP.Api.Models;

public sealed class CustomerDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string? Code { get; set; }
    public string? City { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
