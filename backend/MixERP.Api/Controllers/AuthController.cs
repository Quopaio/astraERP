using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace MixERP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // -> /api/auth/*
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _cfg;
        public AuthController(IConfiguration cfg) => _cfg = cfg;

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            if (!(dto.Username == "admin" && dto.Password == "admin"))
                return Unauthorized(new { message = "Invalid credentials" });

            var issuer = _cfg["Jwt:Issuer"];
            var audience = _cfg["Jwt:Audience"];
            var secretRaw = _cfg["Jwt:Secret"];

            if (string.IsNullOrWhiteSpace(secretRaw))
                return StatusCode(500, new { message = "JWT secret missing (Jwt:Secret)." });

            byte[] keyBytes;
            try { keyBytes = Convert.FromBase64String(secretRaw); }
            catch { keyBytes = Encoding.UTF8.GetBytes(secretRaw); }
            if (keyBytes.Length < 32)
                return StatusCode(500, new { message = "JWT secret must be at least 256 bits (32 bytes)." });

            var creds = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256);
            var claims = new[] { new Claim(ClaimTypes.Name, dto.Username), new Claim(ClaimTypes.Role, "Admin") };
            var token = new JwtSecurityToken(issuer: issuer, audience: audience, claims: claims,
                                             expires: DateTime.UtcNow.AddHours(8), signingCredentials: creds);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = jwt, user = new { id = "1", username = dto.Username, roles = new[] { "Admin" } } });
        }

        public record LoginDto(string Username, string Password);
    }
}
