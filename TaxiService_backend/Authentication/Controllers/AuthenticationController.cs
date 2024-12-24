using Common;
using DataAccessLayer.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Controllers
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            try
            {
                ProfileDTO response = await _authenticationService.LoginUser(loginDTO);

                if (response == null)
                {
                    return BadRequest(new { Message = "Email ili lozinka nisu ispravni!" });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] string googleToken)
        {
            try
            {
                ProfileDTO response = await _authenticationService.LoginWithGoogleAsync(googleToken);

                if (response == null)
                {
                    return BadRequest(new { Message = "Doslo je do greske prilikom prijave!" });
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
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


        [HttpPost("google-register")]
        public async Task<IActionResult> GoogleRegister([FromBody] GoogleLoginDTO googleLoginDTO)
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
                return Ok(new { Message = "Google registracija uspešna" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }

}
