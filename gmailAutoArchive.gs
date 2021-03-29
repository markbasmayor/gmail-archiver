// Original author fwed (contact@fwed.fr)
// Modified from
// https://gist.github.com/anonymous/2cca33d376f7f924fdaa67891ad098cc
// https://medium.com/@fw3d/auto-archive-emails-in-gmail-after-2-days-1ebf0e076b1c

function gmailAutoArchive() {
  gmailAutoarchiveHelper(1);
  gmailAutoarchiveHelper(2);
  gmailAutoarchiveHelper(3);
  gmailAutoarchiveHelper(7);
}

function gmailAutoarchiveHelper(numDays) {
  Logger.log('Running archiver for numDays: %s', numDays);
  var delayDays = numDays; // will only impact emails more than numDays days
  var maxDate = new Date();
  maxDate.setDate(maxDate.getDate()-delayDays); // what was the date at that time?


  // Get all the threads labelled 'autoarchive'
  var label = GmailApp.getUserLabelByName("autoarchive-" + numDays);
  if (label == null || label == undefined) return -1;
  Logger.log('Found label: %s', label.getName());
  
  var threads = label.getThreads(0, 500);
  Logger.log('%s emails have this label.', threads.length);


  var threads = label.getThreads(0, 500).filter(function(thread) {
    // Only include threads older than the limit we set in delayDays
    return (thread.getLastMessageDate() < maxDate && thread.isInInbox());
  });
  
  Logger.log('Preparing to archive %s emails and remove the "archive" label.', threads.length);
  var batch_size = 100;
  while (threads.length) {
    var this_batch_size = Math.min(threads.length, batch_size);
    var this_batch = threads.splice(0, this_batch_size);
    // GmailApp.markThreadsRead(this_batch);
    GmailApp.moveThreadsToArchive(this_batch);
    Logger.log('Removing archive label from messages.');
    for (var i=0; i< this_batch.length; i++) {
      // Logger.log('%s', this_batch[i].getFirstMessageSubject());
      this_batch[i].removeLabel(label);
    }
  }
}

