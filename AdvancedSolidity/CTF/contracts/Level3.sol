// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

/////////////////// ☆☆ extropyio ☆☆ /////////////////////
//     -漫~*'¨¯¨'*·舞~ solidity ctf ~舞·*'¨¯¨'*~漫-     //
/////////////////////////////////////////////////////////

//deployed to  on sepolia

interface Isolution3 {
  function solution(bytes memory packed) external returns (uint16 a, bool b, bytes6 c);
}


contract Level3 is Isolution3 {
    function solution(bytes memory packed) external pure override returns (uint16 a, bool b, bytes6 c) {
        require(packed.length >= 9, "Input too short");

        // Unpack uint16 a (2 bytes)
        a = uint16(uint8(packed[0])) << 8 | uint16(uint8(packed[1]));

        // Unpack bool b (1 byte)
        b = packed[2] != 0;

        // Unpack bytes6 c (6 bytes)
        c = bytes6(uint48(uint8(packed[3])) << 40 | uint48(uint8(packed[4])) << 32 | uint48(uint8(packed[5])) << 24 |
                   uint48(uint8(packed[6])) << 16 | uint48(uint8(packed[7])) << 8 | uint48(uint8(packed[8])));
    }
}