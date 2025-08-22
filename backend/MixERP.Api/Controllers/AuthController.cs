using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _cfg;
    public AuthController(IConfiguration cfg) => _cfg = cfg;

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return Unauthorized(new { message = "Invalid credentials" });

        var secret = _cfg["Jwt:Secret"];
        byte[] keyBytes;

        if (!string.IsNullOrWhiteSpace(secret))
        {
            // treat as plain text; require >= 32 bytes for HS256
            if (Encoding.UTF8.GetByteCount(secret) < 32)
            {
                // If you prefer base64 secrets, decode here instead of UTF8:
                // keyBytes = Convert.FromBase64String(secret);
                // and then ensure keyBytes.Length >= 32
                // For now, fallback to a secure random 32-byte key:
                keyBytes = RandomNumberGenerator.GetBytes(32);
            }
            else
            {
                keyBytes = Encoding.UTF8.GetBytes(secret);
            }
        }
        else
        {
            keyBytes = RandomNumberGenerator.GetBytes(32);
        }

        var creds = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: new[] {
                new Claim(ClaimTypes.Name, dto.Username),
                new Claim(ClaimTypes.Role, "Admin")
            },
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(new { token = jwt, user = new { id = "1", username = dto.Username, roles = new[] { "Admin" } } });
    }

    public record LoginDto(string Username, string Password);
}
