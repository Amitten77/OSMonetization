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

    function stage1VerifyUsers(string[] memory _users, string[] memory _decisions, uint _repo_id) public {
        //use msg.sender to get the user that's calling this contract
        //users will be strings of github username, decision will be 'yes', 'no', or 'maybe'
    }

    //Stage two verification will happen off chain because it deals with images

    function stage357VerifyUsers(uint _stage, string[] memory _users, string[] memory _decisions, string[] memory _direction) public {

    }

    function moveStage(uint _repo_id) public {

    }
   

}