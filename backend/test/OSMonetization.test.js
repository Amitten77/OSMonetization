const { assert } = require('chai')

const OSMonetization = artifacts.require("./OSMonetization.sol")

require('chai').use(require('chai-as-promised')).should()

contract('Contract is Alive', ([deployer, user1, user2, user3]) => {
    let contract

    before(async () => {
        contract = await OSMonetization.deployed()
    })


    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await contract.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await contract.name()
            assert.equal(name, 'OS Monetization')
            assert.notEqual(name, 'Vikram')
        })
    })

    describe('Account Registration', async () => {
        before(async () => {
            await contract.registerUser('ssure4', { from: deployer })
        })

        it('account created successfully', async () => {
            const user = await contract.github_to_address('ssure4')
            const username = await contract.address_to_github(deployer)

            assert.equal('ssure4', username, 'username is correct')
            assert.notEqual('ssure5', username, 'username is correct')

        })

        it('cannot create invalid account', async () => {
            await contract.registerUser('ssure4', { from: deployer }).should.be.rejected;
            await contract.registerUser('', { from: user1 }).should.be.rejected;

        })

    })

    // describe('Added Repository Successfully', async () => {

    //     before(async () => {
    //         await contract.createRepo('https://github.com/Amitten77/HackIllinois2023', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10, 10])
    //     })

    //     it('Repository was successfully added', async () => {
    //         const repo = await contract.id_to_repo(1);
    //         assert.equal(repo.url, 'https://github.com/Amitten77/HackIllinois2023', 'Repository URL is Equal :)')
    //         assert.equal(repo.num_contributors, 3, 'Number of contribuitors is consistent')
    //     })

    //     it('Invalid Repository Additions', async () => {
    //         await contract.createRepo('https://github.com/Amitten77/HackIllinois2023', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10, 10]).should.be.rejected;
    //         await contract.createRepo('hello world', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10]).should.be.rejected;
    //         await contract.createRepo('hello world', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10], { from: user2 }).should.be.rejected;
    //     })

    // })

    describe('Added Repository Successfully', async () => {

        before(async () => {
            await contract.createRepo('https://github.com/Amitten77/HackIllinois2023', 'HackIllinois2023', ['dkulgod', 'saldanaxochilth', 'eziCode', 'Ameat77'], [3, 42, 34, 70], [496, 0, 9082, 50448], [2, 2, 2, 3], 4)
        })

        it('Repository was successfully added', async () => {
            const repo = await contract.id_to_repo(1);
            assert.equal(repo.url, 'https://github.com/Amitten77/HackIllinois2023', 'Repository URL is Equal :)')
            assert.equal(repo.num_contributors, 4, 'Number of contribuitors is consistent')
            const ans1 = await contract.getRepoContributor(1, 0);
            assert.equal(ans1, 'dkulgod');
            const ans2 = await contract.getRepoPercent(1, 3);
            assert.equal(ans2, 81688);
        })

        // it('Invalid Repository Additions', async () => {
        //     await contract.createRepo('https://github.com/Amitten77/HackIllinois2023', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10, 10]).should.be.rejected;
        //     await contract.createRepo('hello world', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10]).should.be.rejected;
        //     await contract.createRepo('hello world', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10], { from: user2 }).should.be.rejected;
        // })

    })

    describe('CalcWeightedCredit', async () => {
        it('Should return the correct weighted proportions for each developer', async () => {

            let result = await contract.calcWeightedCredit(["John", "David", "Jill"], [18, 20, 3], [90, 20, 60], [20, 17, 25], 30);

            let event = result.logs[0].args;

            assert.equal(event.credit[0], 57629, "Success")
            assert.equal(event.credit[1], 21881, "Success")
            assert.equal(event.credit[2], 20490, "Success")

            let result2 = await contract.calcWeightedCredit(["John", "David", "Jill", "Jack"], [18, 20, 3, 90], [90, 20, 60, 45], [20, 17, 25, 30], 30);

            let event2 = result2.logs[0].args;

            assert.equal(event2.credit[0], 19902, "Success")
            assert.equal(event2.credit[1], 8550, "Success")
            assert.equal(event2.credit[2], 12969, "Success")
            assert.equal(event2.credit[3], 58579, "Success")

            let result3 = await contract.calcWeightedCredit(["John", "David", "Jill", "Jack", "Jen"], [18, 20, 3, 90, 5], [90, 20, 60, 45, 3], [20, 17, 25, 30, 4], 30);

            let event3 = result3.logs[0].args;

            assert.equal(event3.credit[0], 19860, "Success")
            assert.equal(event3.credit[1], 8298, "Success")
            assert.equal(event3.credit[2], 12941, "Success")
            assert.equal(event3.credit[3], 56356, "Success")
            assert.equal(event3.credit[4], 2545, "Success")
        });
    })


})