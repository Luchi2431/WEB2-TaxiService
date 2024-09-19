class Ride{
    constructor({id, userId, driverId, startAddress, endAddress, estimatedPrice, estimatedRideTime, estimatedArrivalTime, rideStatus, createdAt, rating}){
        this.Id = id;
        this.UserId = userId;
        this.DriverId = driverId;
        this.StartAddress = startAddress;
        this.EndAddress = endAddress;
        this.EstimatedPrice = estimatedPrice;
        this.EstimatedRideTime = estimatedRideTime;
        this.EstimatedArrivalTime = estimatedArrivalTime;
        this.RideStatus = rideStatus;
        this.CreatedAt = createdAt;
        this.Rating = rating;
    }
}

export default Ride;