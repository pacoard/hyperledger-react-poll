'use strict';
/**
 * Poll-network transactions processor functions
 */

function emitTraceEvent(namespace, eventname, message, payload) {
    var event = getFactory().newEvent(namespace, eventname);
    event.message = message;
    try {
        event.payload = "object: " + typeof(payload) + " " + JSON.stringify(payload);
    } catch (err) {
        event.payload = "resource: " + JSON.stringify(serializer.toJSON(payload,{validate:false})); // yes, seriously
    }
    emit(event);
}

function emitEvent(namespace, eventname, tx) {
    var event = getFactory().newEvent(namespace, eventname);
    event.tx = tx;

    try {
        emit(event);
    } catch (err) {
        emitTraceEvent(namespace, "LogInfoEvent", "Emit failed with: ", err);
    }
}


/**
 * Poll creation transaction
 * @param {net.biz.poll.CreatePoll} tx
 * @transaction
 */
function CreatePoll(tx) {
    // Get the asset registry for Polls
    return getAssetRegistry('net.biz.poll.Poll')
        .then(function (assetRegistry) {
            // Create an asset to hold the incoming values
            var factory = getFactory();
            var Poll = factory.newResource('net.biz.poll', 'Poll', tx.pollId);
            Poll.pollId = tx.pollId;
            Poll.pollObject = tx.pollObject;
            Poll.pollOwner = tx.pollOwner;
      
            // Add the asset to the asset registry
            // (Add a poll object to the blockchain)
            return assetRegistry.add(Poll);
        })
        .then(function() {
            // Emit an event for the created asset
            emitEvent('net.biz.poll', 'Create poll event', tx);
        });
}

/**
 * Poll deletion transaction
 * @param {net.biz.poll.DeletePoll} tx
 * @transaction
 */
function DeletePoll(tx) {
    // Get the asset registry for Polls
    var assetRegistry;
    var id = tx.relatedAsset.assetId;

    return getAssetRegistry('net.biz.poll.Poll')
        // Get asset that will be updated in this transaction
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(asset) {
            // (Remove poll object from the blockchain)
            return assetRegistry.remove(asset);
        })
        .then(function() {
            // Emit an event for the created asset
            emitEvent('net.biz.poll', 'Delete poll event', tx);
        });
}

/**
 * Answer poll transaction
 * @param {net.biz.poll.AnswerPoll} tx
 * @transaction
 */
function AnswerPoll(tx) {
    var assetRegistry;
    var id = tx.relatedAsset.assetId;

    return getAssetRegistry('net.biz.poll.Poll')
        // Get asset that will be updated in this transaction
        .then(function(ar) {
            assetRegistry = ar;
            return assetRegistry.get(id);
        })
        .then(function(asset) {
            asset.value = tx.newValue;
            // Sum answers to the poll
            for (int i = 0; i < tx.answers.length; i++) {
                for (int j = 0; j < tx.answers[i].length; j++) {
                    asset.pollObject.questions[i].count[j] += tx.answers[i].count[j];
                }
            }
            // Update the asset in the asset registry
            // (Update poll object in the blockchain)
            return assetRegistry.update(asset);
        })
        .then(function() {
            // Emit an event for the created asset
            emitEvent('net.biz.poll', 'Answer event', tx);
        });
}