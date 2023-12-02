// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// https://solidity-by-example.org/
// Maybe refactor to Rust Later...

contract OSMonetization {

    //Put into Getters instead of leaving as public variables
    mapping(string => uint[]) public user_repos; //user to a list of repositories (id)
    mapping(address => string) public address_to_github; //Relates a metamask address to github username
    mapping(string => address) public github_to_address; //Relates a github username to metamask address
    mapping (uint => Respository) public id_to_repo;
    mapping (string => uint) public url_to_id; //Github URL to Repository ID
    uint public repo_id = 1;
    string public name;
    /*
    

    Amit 

    Dylan's Function:
    Input: (User Map, Total Days) {
        helper function to get amount of people to give credit to
        Output: Map of people shortlisted and initial percentages
    }


    Jesse's Function:
    Input: List of all usernames, how many people each person should peer review
    Output: Map of each person to a list of people they will peer review

    */

    struct Respository {
        uint repo_id;
        string url; 
        string repo_name;
        uint stage;
        uint num_contributors;
        string[] contributors;
        uint[] percent_stake;
    }



    constructor() public {
        name = "OS Monetization";
    }


    /*
    Percent represented as a 5 digit number:
    78962 -> 78.962%
    */
    //NOTE: MASSIVE SECURITY RISK CUZ ITS PUBLIC
    function registerUser(string memory _username) public {
        require(bytes(_username).length > 0);
        require(github_to_address[_username] == address(0));
        require(bytes(address_to_github[msg.sender]).length == 0);

        github_to_address[_username] = msg.sender;
        address_to_github[msg.sender] = _username;

    }


    function createRepo(string memory _repositoryURL, string memory _repository, uint totalDays, string[] memory _users, uint[] memory _num_commits, uint[] memory _days_worked, uint[] memory _changes_made) public {
        //Call to Dylans Function uint[] memory _percents = Dylan's Function
        uint[] memory percents  = new uint[](_users.length);
        for (uint256 i = 0; i < _users.length; i++) {
            percents[i] = 10000;
        }
        createRepoHelper(_repositoryURL, _repository, _users, percents);
    }


    //Problem if user decides to change their repository name or username to something else
    //Decimal represented as five digit number: 78123 -> 78.123%
    function createRepoHelper(string memory _repositoryURL, string memory _repository,  string[] memory _users, uint[] memory _percents) public {

        require(bytes(address_to_github[msg.sender]).length != 0);
        require(url_to_id[_repositoryURL] == 0);
        require(_users.length == _percents.length);


        Respository memory repo = Respository(repo_id, _repositoryURL, _repository, 1, _users.length, _users, _percents);
        id_to_repo[repo_id] = repo;
        url_to_id[_repositoryURL] = repo_id;
        for (uint i = 0; i < _users.length; i++) {
            user_repos[_users[i]].push(repo_id);
        }
        repo_id += 1;

    }


    event Credit(
      string credit
    );

    function calcWeightedCredit(uint totalDays) public returns (string memory) {
        string memory value = "1";
        emit Credit(value);
        return value;
    }

    // function stageOneVerifyUsers(string memory _username, mapping(string=> string) memory _decision) {
        //create the 2d array 
        //the map contains decisisions
    // }

    //mapping (int256=> mapping(string=> int256[])) public userDecisions; // this maps a particular project's id to a mapping of userdecisions 
    
    // Function to create the map
    //userDecisions will map a username to an array of length to the # of users 
    // -1 means the username hasn't voted for a particlualr person at a certain index 
    /*
    function initMap(string[] memory usernames) public {
        // Iterate through each string in the array
        for (uint i = 0; i < usernames.length; i++) {
            int[] memory newarr = new int256[](usernames.length);
            for (uint j = 0; j < newarr.length; j++) {
                newarr[j] = -1;
            }
            userDecisions[usernames[i]] = newarr;
        }
    }
    

    function initProjectMap(string[] memory usernames, int256 projectid) public {
        mapping(string=> int256[]) memory projectmap;
    
        for (uint i = 0; i < usernames.length; i++) {
            int[] memory newarr = new int256[](usernames.length);
            for (uint j = 0; j < newarr.length; j++) {
                newarr[j] = -1; 
            }
            projectmap[usernames[i]] = newarr; 
        }
        userDecisions[projectid] = projectmap; 
    }
    */


    //##################### STAGE 1 STARTS HERE ##############################
    mapping(int256 => int256[10][10]) public userDecisions; 

    mapping(int256=> string[]) public usernames; //this maps a particular project's id to a string array containg usernames of that particular project 


    function initProjectMap(string[] memory users, int256 projectid) public {
        int256[10][10] storage projectmap = userDecisions[projectid]; // Directly reference storage
        require(projectmap.length == 0, "Project map already initialized");

        for (uint256 i = 0; i < 10; i++) {
            for (uint256 j = 0; j < 10; j++) {
                projectmap[i][j] = -1; // Initialize with a value of your choice
            }
        }
        usernames[projectid] = users;
    }


    //index represents the user that you want to vote for, it is zero indexed. 
    function voteDecision(string memory _username, string memory _targetusername, int8 decision, int256 projectid) public {
        require(decision == 0 || decision == 1, "Invalid decision");
        //get the index associated with teh _username 
        int256 indexofusername = findIndex(_username, usernames[projectid]);

        int256 indexoftargetusername = findIndex(_targetusername, usernames[projectid]);
        
        require(indexofusername != -1, "username not found");
        require(indexoftargetusername != -1, "target username not found");
        // Set the decision at the specified index
        userDecisions[projectid][uint256(indexofusername)][uint256(indexoftargetusername)] = decision; 
        //userDecisions[_username][index] = decision;
    }

    function findIndex(string memory target, string[] memory stringArray) public view returns (int256) {
        for (uint256 i = 0; i < stringArray.length; i++) {
            if (keccak256(abi.encodePacked(stringArray[i])) == keccak256(abi.encodePacked(target))) {
                // Strings match, return the index
                return int256(i);
            }
        }

        // String not found, return -1
        return -1;
    }

    // Function to determine if a username should be verified
    function shouldVerify(string memory _username, int256 projectid) external view returns (bool) { 
        uint256 numDecisions = 0; 
        uint256 approves = 0; 
        uint256 disproves = 0;

        int256[10][10] memory projectmap = userDecisions[projectid];
        string[] memory projectusernames = usernames[projectid];

        int256 indextocheck = findIndex(_username, projectusernames);
        require(indextocheck != -1, "username is not valid");
        for (uint i = 0; i < 10; i++) {
            if (projectmap[i][uint256(indextocheck)] != -1) {
                numDecisions++; 
            }

            if (projectmap[i][uint256(indextocheck)] == 1) {
                approves++; 
            } 
            if (projectmap[i][uint256(indextocheck)] == 0) {
                disproves++; 
            }
        }

        require(numDecisions > 0, "No one has voted for this user yet. Unable to verify");
        return (approves > disproves);
    }
}