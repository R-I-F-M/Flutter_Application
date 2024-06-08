const express = require('express');
const WebSocket = require('ws');
// const Gpio = require('onoff').Gpio; // Import the onoff library for GPIO control

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });


// Setup GPIO pin, assuming GPIO 17 is used for example
// const led = new Gpio(17, 'out'); // Change the pin number as needed

app.use(express.json());

app.post('/send-message', (req, res) => {
  const { message } = req.body;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      console.log('Sent message to client:', message); // Log the sent message
    }
  });
  res.send('Message sent to all clients');
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('Received message from Flutter:', message.toString());
    if (message.toString() === 'ConnectDrone') {
      // Execute GPIO operation: Turn on the LED
      try {
        // led.writeSync(1); // Set GPIO pin highcle
        ws.send('Drone Server Connected');
        console.log('Sent response to Flutter: Drone Server Connected');
        
        // Optionally, turn off the LED after a certain time (e.g., 5 seconds)
        // setTimeout(() => {
        //   try {
        //     led.writeSync(0); // Set GPIO pin low
        //   } catch (err) {
        //     console.error('Failed to turn off the LED:', err);
        //   }
        // }, 5000);
      } catch (err) {
        console.error('Failed to turn on the LED:', err);
        ws.send('Error: Failed to connect to the drone');
      }
    }
  });
});

// Clean up GPIO state on exit
// const cleanUp = () => {
//   try {
//     led.writeSync(0); // Turn off the LED
//     led.unexport(); // Unexport the GPIO pin
//   } catch (err) {
//     console.error('Failed to clean up GPIO:', err);
//   }
//   process.exit();
// };

// process.on('SIGINT', cleanUp); // Handle Ctrl+C
// process.on('SIGTERM', cleanUp); // Handle termination signal

server.listen(8080, () => {
  console.log('Server started on port 8080');
});
