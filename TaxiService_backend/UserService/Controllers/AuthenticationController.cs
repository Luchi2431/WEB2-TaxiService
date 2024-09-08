using Authentication.Interface;
using Common;
using DataAccessLayer.DTO;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserService.Controllers
{
    [ApiController]
    [Route("api/authentication")]
    public class AuthenticationController : Controller
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterDTO registerDto, IFormFile? image = null)
        {
            try
            {
                var user = await _authenticationService.RegisterUserAsync(registerDto, image);
                return Ok(new { Message = "Registracija uspešna. Molimo sačekajte potvrdu." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDTO googleLoginDTO)
        {
            try
            {
                if (googleLoginDTO.UserType == "User")
                {
                    var user = await _authenticationService.RegisterOrLoginWithGoogleAsync(googleLoginDTO.Token, UserType.User);
                }
                else if (googleLoginDTO.UserType == "Driver")
                {
                    var user = await _authenticationService.RegisterOrLoginWithGoogleAsync(googleLoginDTO.Token, UserType.Driver);
                }
                return Ok(new { Message = "Google login uspešan" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO LoginDTO)
        {
            try
            {
                ProfileDTO response = await _authenticationService.LoginUser(LoginDTO);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }


        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                // Dobij ID korisnika iz Claims
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub"); // Proveri da li koristiš "id"
                if (userIdClaim == null)
                {
                    return Unauthorized(new { Message = "Korisnik nije prijavljen." });
                }

                // Pretvori Claim value u int
                var userId = int.Parse(userIdClaim.Value);

                // Pretpostavljam da tvoj AuthenticationService ima metodu GetUserProfileAsync
                var profile = await _authenticationService.GetUserProfileAsync(userId);

                if (profile == null)
                {
                    return NotFound(new { Message = "Korisnik nije pronađen." });
                }

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }

}
