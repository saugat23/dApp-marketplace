pragma solidity ^0.8.27;

contract SimpleCounter{
  uint256 public number;

  constructor (uint256 initialNumber) public {
    number = initialNumber;
  }

  event NumberIncremented(uint256 updatedNumber);
  event NumberDecremented(uint256 updatedNumber);

  function increment() public{
    number += 1;
    emit NumberIncremented(number);
  }

  function decrement() public{
    number -= 1;
    emit NumberDecremented(number);
  }
}
