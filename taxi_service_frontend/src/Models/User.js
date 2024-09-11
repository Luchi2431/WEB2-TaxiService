class User {
    constructor({id,username,email,firstName,lastName,birthDate,address,token,userType,isVerified,profilePicture}) {
      this.Id=id;
      this.Username= username;
      this.Email= email;
      this.FirstName=firstName;
      this.LastName= lastName;
      this.BirthDate = birthDate;
      this.Address = address;
      this.Token = token;
      this.UserType = userType;
      this.IsVerified = isVerified;
      this.ProfilePicture = profilePicture;
    }
  }
  
  
  
  export default User;