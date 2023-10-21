const { assert } = require('chai')

const OSMonetization = artifacts.require("./OSMonetization.sol")

require('chai').use(require('chai-as-promised')).should()

contract('Contract is Alive', ([deployer, user1, user2, user3]) => {
    let contract

    before(async () => {
        contract = await OSMonetization.deployed()
    })


    describe('deployment', async() => {
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

    describe('Account Registration', async() => {
        before(async () => {
            await contract.registerUser('ssure4', {from: deployer})
        })

        it('account created successfully', async () => {
            const user = await contract.github_to_address('ssure4')
            const username = await contract.address_to_github(deployer)

            assert.equal('ssure4', username, 'username is correct')
            assert.notEqual('ssure5', username, 'username is correct')

        })

        it('cannot create invalid account', async () => {
            await contract.registerUser('ssure4', {from: deployer}).should.be.rejected;
            await contract.registerUser('', {from: user1}).should.be.rejected;

        })

    })

    describe('Added Repository Successfully', async() => {

        before(async () => {
            await contract.createRepo('https://github.com/Amitten77/HackIllinois2023', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10, 10])
        })

        it('Repository was successfully added', async () => {
            const repo = await contract.id_to_repo(1);
            assert.equal(repo.url, 'https://github.com/Amitten77/HackIllinois2023', 'Repository URL is Equal :)')
            assert.equal(repo.num_contributors, 3, 'Number of contribuitors is consistent')
        })

        it('Invalid Repository Additions', async () => {
            await contract.createRepo('https://github.com/Amitten77/HackIllinois2023', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10, 10]).should.be.rejected;
            await contract.createRepo('hello world', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10]).should.be.rejected;
            await contract.createRepo('hello world', 'HackIllinois2023', ['Amitten77', 'sw4th1', 'yaogurt'], [99980, 10], {from: user2}).should.be.rejected;
        })

    })


})