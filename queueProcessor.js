const { QueueServiceClient } = require('@azure/storage-queue');
const { DefaultAzureCredential } = require('@azure/identity');

const queueServiceClient = new QueueServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.queue.core.windows.net`,
  new DefaultAzureCredential()
);

const queueName = "appointmentsqueue"; 
const queueClient = queueServiceClient.getQueueClient(queueName);

async function listMessages() {
  try {
    const messages = await queueClient.receiveMessages({ numberOfMessages: 10 });
    if (messages.receivedMessageItems.length > 0) {
      console.log("Kuyruktan alınan mesajlar:", messages.receivedMessageItems);

    } else {
      console.log("Kuyruk boş.");
    }
  } catch (error) {
    console.error("Mesajlar alınırken hata oluştu:", error);
  }
}

setInterval(listMessages, 5000); 
