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


        #region Authentification

      

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

        #endregion



        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(int id)
        {
            try
            {
                ProfileDTO response = await _authenticationService.GetUserProfileAsync(id);
                return Ok(response);

            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [HttpPut("profileUpdate")]
        public async Task<IActionResult> ProfileUpdate([FromForm] ProfileDTO profileDTO, IFormFile? profilePicture = null)
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


        #region NewRide

        [HttpPost("estimate")]
        public async Task<IActionResult> EstimateRide(string startAddress, string endAddress)
        {
            try
            {
                var estimate = await _authenticationService.EstimateRideAsync(startAddress, endAddress);
                return Ok(estimate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // Endpoint to confirm the ride
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmRide([FromForm] RideDTO rideDto)
        {
            try
            {
                if (TimeSpan.TryParse(rideDto.EstimatedTime.ToString(), out TimeSpan estimatedTime))
                {
                    // Sada možeš da koristiš estimatedTime
                    rideDto.EstimatedTime = estimatedTime;
                }
                else
                {
                    // Obradi grešku ako ne možeš da konvertuješ
                    return BadRequest("Invalid time format.");
                }



                var ride = await _authenticationService.ConfirmRideAsync(rideDto);
                return Ok(new { Message = "Ride confirmed", Ride = ride });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
        #endregion


        #region NewDriverRides

        [HttpGet("new-rides")]
        public async Task<IActionResult> GetNewRides()
        {
            try
            {
                var newRides = await _authenticationService.GetNewRidesAsync();
                return Ok(newRides);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        

        [HttpPost("accept")]
        public async Task<IActionResult> AcceptRide([FromBody] AcceptRideRequestDTO request)
        {
            try
            {
                var success = await _authenticationService.AcceptRideAsync(request.RideId,request.DriverId);
                if (success == null)
                {
                    return BadRequest(new { Message = "Vožnja nije pronađena ili je već prihvaćena." });
                }

                return Ok(success);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        #endregion



        [HttpGet("previousRides")]
        public async Task<IActionResult> GetPreviousRides(int id)
        {
            try
            {
                var previousRides = await _authenticationService.GetPreviousRidesAsync(id);
                return Ok(previousRides);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("myRides")]
        public async Task<IActionResult> GetMyRides(int id)
        {
            try
            {
                var myRides = await _authenticationService.GetMyRidesAsync(id);
                return Ok(myRides);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("allRides")]
        public async Task<IActionResult> GetAllRides()
        {
            try
            {
                var allRides = await _authenticationService.GetAllRidesAsync();
                return Ok(allRides);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }









    }

}
