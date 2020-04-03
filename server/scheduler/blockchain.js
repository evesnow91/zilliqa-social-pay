const debug = require('debug')('zilliqa-social-pay:scheduler:blockchain');
const zilliqa = require('../zilliqa');
const models = require('../models');
const eventUtils = require('../event-utils');

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const Blockchain = models.sequelize.models.blockchain;

module.exports = async function() {
  try {
    const blockchainInfo = await zilliqa.blockchainInfo();
    const contractInfo = await zilliqa.getInit();
    const { balance } = await zilliqa.getCurrentAccount(CONTRACT_ADDRESS);

    let currenInfo = await Blockchain.findOne({
      where: { contract: CONTRACT_ADDRESS }
    });

    if (!currenInfo) {
      debug('cannot find to blockchain info. currenInfo:', currenInfo, 'contracta address', CONTRACT_ADDRESS);

      await Blockchain.create({
        ...blockchainInfo,
        ...contractInfo,
        balance,
        contract: CONTRACT_ADDRESS,
        BlockNum: blockchainInfo.NumTxBlocks,
        DSBlockNum: blockchainInfo.CurrentDSEpoch,
        initBalance: balance
      });

      currenInfo = await Blockchain.findOne({
        where: { contract: CONTRACT_ADDRESS }
      });
    }
    let initBalance = currenInfo.initBalance;

    if (Number(initBalance) < Number(balance)) {
      initBalance = balance;
    }

    await currenInfo.update({
      ...blockchainInfo,
      ...contractInfo,
      balance,
      initBalance,
      BlockNum: blockchainInfo.NumTxBlocks,
      DSBlockNum: blockchainInfo.CurrentDSEpoch
    });

    debug('blockchain info has been updated.');
  } catch (err) {
    debug('update blockchain info error:', err);
  }

  await zilliqa.blockSubscribe(async (newBlock) => {
    const currenInfo = await Blockchain.findOne({
      where: { contract: CONTRACT_ADDRESS }
    });

    if (!currenInfo) {
      return null;
    }

    const { balance } = await zilliqa.getCurrentAccount(CONTRACT_ADDRESS);
    const rate = new Date() - new Date(currenInfo.updatedAt);

    await currenInfo.update({
      ...newBlock,
      rate,
      balance
    });

    debug('next block has been created, block:', newBlock.BlockNum);
  });

  await zilliqa.eventSubscribe(async (event) => {
    const { _eventname, params } = event;

    if (!params || !_eventname) {
      return null;
    }

    debug('Event ', _eventname, 'has been emited');

    try {
      switch (_eventname) {
        case eventUtils.events.DeletedAdmin:
          const disabledAdmin = await eventUtils.deletedAdmin(params);
          debug('Admin has been disabled', disabledAdmin);
          break;
  
        case eventUtils.events.AddedAdmin:
          const addedAdmin = await eventUtils.addedAdmin(params);
          debug('Admin has been added', addedAdmin);
          break;

        case eventUtils.events.ConfiguredUserAddress:
          const userProfileId = await eventUtils.configuredUserAddress(params);
          debug('User address has been updated, profileID', userProfileId);
          break;

        case eventUtils.events.VerifyTweetSuccessful:
          const tweetID = await eventUtils.verifyTweetSuccessful(params);
          debug('Tweet with id:', tweetID, 'has been verified.');
          break;

        case eventUtils.events.DepositSuccessful:
          await eventUtils.depositSuccessful(params);
          debug('depositSuccessful');
          break;

        case eventUtils.events.Error:
          debug('Error:', JSON.stringify(params, null, 4));
          break;

        default:
          debug('unknown event:', _eventname);
          break;
      }
    } catch (err) {
      debug('Event ', _eventname, 'ERROR', err);
    }

    console.log(JSON.stringify(event, null, 4));
  });
}
