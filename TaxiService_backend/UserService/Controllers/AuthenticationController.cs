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

        [HttpPost("googleRegister")]
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

        [HttpPost("googleLogin")]
        public async Task<IActionResult> GoogleLogin([FromBody] string token)
        {
            try
            {
                ProfileDTO response = await _authenticationService.LoginWithGoogleAsync(token);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message, StackTrace = ex.StackTrace });
            }
        }


        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(int id)
        {
            try
            {
                ProfileDTO response =  await _authenticationService.GetUserProfileAsync(id);
                return Ok(response);

            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpPut("profileUpdate")]
        public async Task<IActionResult> ProfileUpdate([FromForm] ProfileDTO profileDTO,IFormFile? profilePicture = null)
        {
            try
            {
              

                var updatedUser = await _authenticationService.UpdateUserProfileAsync(profileDTO, profilePicture);


                return Ok(new { Message = "Profil uspešno ažuriran", UpdatedUser = updatedUser });

            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        #region Verification
        


        [HttpGet("getDrivers")]
        public async Task<IActionResult> GetDrivers()
        {
            try
            {
                var drivers = await _authenticationService.GetDriversAsync();
                return Ok(drivers);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("approve")]
        public async Task<IActionResult> ApproveDriver(int id)
        {
            try
            {
                bool success = await _authenticationService.ApproveDriverAsync(id);
                if (!success)
                {
                    return BadRequest(new { Message = "Vozač nije pronađen, nije vozač ili je već odobren." });
                }

                return Ok(new { Message = "Vozač uspešno odobren." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPut("reject")]
        public async Task<IActionResult> RejectDriver(int id)
        {
            try
            {
                bool success = await _authenticationService.RejectDriverAsync(id);
                if (!success)
                {
                    return BadRequest(new { Message = "Vozač nije pronađen, nije vozač ili je već odbijen." });
                }

                return Ok(new { Message = "Vozač uspešno odbijen." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        #endregion


    }

}
