pragma solidity ^0.4.2;

import "./zeppelin/lifecycle/Killable.sol";

contract Rideshare is Killable {
    struct Passenger {
        uint256 price;
        string state; // initial, driverConfirmed, passengerConfirmed, enRoute, completion, canceled
    }

    struct Ride {
        address driver;
        uint256 drivingCost;
        uint256 capacity;
        string originAddress;
        string destAddress;
        uint256 createdAt;
        uint256 confirmedAt;
        uint256 departAt;
        mapping(address => Passenger) passengers;
        address[] passengerAccts;
    }

    Ride[] public rides;
    uint256 public rideCount;

    mapping(address => uint256) reputation;

    // for now, only drivers can create Rides
    function createRide(
        uint256 _driverCost,
        uint256 _capacity,
        string _originAddress,
        string _destAddress,
        uint256 _confirmedAt,
        uint256 _departAt
    ) {
        address[] memory _passengerAccts;
        rides.push(
            Ride(
                msg.sender,
                _driverCost,
                _capacity,
                _originAddress,
                _destAddress,
                block.timestamp,
                _confirmedAt,
                _departAt,
                _passengerAccts
            )
        );
    }

    // called by passenger
    function joinRide(uint256 rideNumber) public payable {
        Ride curRide = rides[rideNumber];
        require(msg.sender != curRide.driver);
        require(msg.value == curRide.drivingCost);

        var passenger = curRide.passengers[msg.sender];

        passenger.price = msg.value;
        passenger.state = "initial";

        rides[rideNumber].passengerAccts.push(msg.sender) - 1; //***
    }

    function getPassengers(uint256 rideNumber) public view returns (address[]) {
        return rides[rideNumber].passengerAccts;
    }

    function getPassengerRideState(uint256 rideNumber, address passenger)
        public
        view
        returns (string)
    {
        return rides[rideNumber].passengers[passenger].state;
    }

    function getRide(uint256 rideNumber)
        public
        view
        returns (
            address _driver,
            uint256 _drivingCost,
            uint256 _capacity,
            string _originAddress,
            string _destAddress,
            uint256 _createdAt,
            uint256 _confirmedAt,
            uint256 _departAt
        )
    {
        Ride ride = rides[rideNumber];
        return (
            ride.driver,
            ride.drivingCost,
            ride.capacity,
            ride.originAddress,
            ride.destAddress,
            ride.createdAt,
            ride.confirmedAt,
            ride.departAt
        );
    }

    function getRideCount() public constant returns (uint256) {
        return rides.length;
    }

    function passengerInRide(uint256 rideNumber, address passengerAcct)
        returns (bool)
    {
        Ride curRide = rides[rideNumber];
        for (uint256 i = 0; i < curRide.passengerAccts.length; i++) {
            if (curRide.passengerAccts[i] == passengerAcct) {
                return true;
            }
        }
        return false;
    }

    function cancelRide(uint256 rideNumber) {
        Ride curRide = rides[rideNumber];
        require(block.timestamp < curRide.confirmedAt);
        if (msg.sender == curRide.driver) {
            for (uint256 i = 0; i < curRide.passengerAccts.length; i++) {
                curRide.passengerAccts[i].transfer(
                    curRide.passengers[curRide.passengerAccts[i]].price
                );
            }
        } else if (passengerInRide(rideNumber, msg.sender)) {
            msg.sender.transfer(curRide.passengers[msg.sender].price);
        }
    }

    // called by passenger
    function confirmDriverMet(uint256 rideNumber) {
        require(passengerInRide(rideNumber, msg.sender));
        Ride curRide = rides[rideNumber];
        if (
            keccak256(curRide.passengers[msg.sender].state) ==
            keccak256("passengersConfirmed")
        ) {
            curRide.passengers[msg.sender].state = "enRoute";
        } else {
            curRide.passengers[msg.sender].state = "driverConfirmed";
        }
    }

    // called by driver
    function confirmPassengersMet(
        uint256 rideNumber,
        address[] passengerAddresses
    ) {
        Ride curRide = rides[rideNumber];
        require(msg.sender == curRide.driver);
        for (uint256 i = 0; i < passengerAddresses.length; i++) {
            string curState = curRide.passengers[passengerAddresses[i]].state;
            if (
                keccak256(curRide.passengers[passengerAddresses[i]].state) ==
                keccak256("driverConfirmed")
            ) {
                curRide.passengers[passengerAddresses[i]].state = "enRoute";
            } else {
                curRide.passengers[passengerAddresses[i]]
                    .state = "passengersConfirmed";
            }
        }
        // require(rides[rideNumber].state == "confirmed");
    }

    function enRouteList(uint256 rideNumber) public view returns (address[]) {
        Ride curRide = rides[rideNumber];
        address[] addressesEnRoute;
        for (uint256 i = 0; i < curRide.passengerAccts.length; i++) {
            if (
                keccak256(
                    curRide.passengers[curRide.passengerAccts[i]].state
                ) == keccak256("enRoute")
            ) {
                addressesEnRoute.push(curRide.passengerAccts[i]);
            }
        }
    }

    // called by passenger
    function arrived(uint256 rideNumber) {
        require(passengerInRide(rideNumber, msg.sender));
        Ride curRide = rides[rideNumber];
        curRide.driver.transfer(curRide.passengers[msg.sender].price);
        curRide.passengers[msg.sender].state = "completion";
    }
}
