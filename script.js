const nodes = document.querySelectorAll('.node');
const canvas = document.getElementById('wire-canvas');
const introScreen = document.getElementById('intro-screen');
const portfolioScreen = document.getElementById('portfolio-screen');
const flashOverlay = document.getElementById('flash-overlay');
const bulb = document.getElementById('bulb');
const instructionText = document.getElementById('instruction-text');

let selectedNode = null;
let connectionsMade = 0;
const totalConnections = 3;

// Helper to get relative coordinates inside the SVG canvas
function getCenterCoords(element) {
  const rect = element.getBoundingClientRect();
  const containerRect = canvas.getBoundingClientRect();
  return {
    x: rect.left - containerRect.left + (rect.width / 2),
    y: rect.top - containerRect.top + (rect.height / 2)
  };
}

// Draw a curved "tangled" wire between two points using an SVG Path
function drawWire(node1, node2, color) {
  const pos1 = getCenterCoords(node1);
  const pos2 = getCenterCoords(node2);
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  
  // Create a bezier curve to make it look like a loose, tangled wire
  const offset = 100; 
  const d = `M ${pos1.x} ${pos1.y} C ${pos1.x + offset} ${pos1.y}, ${pos2.x - offset} ${pos2.y}, ${pos2.x} ${pos2.y}`;
  
  path.setAttribute('d', d);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '6');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-linecap', 'round');
  
  canvas.appendChild(path);
}

// Node click handler
nodes.forEach(node => {
  node.addEventListener('click', function() {
    if (this.classList.contains('connected')) return;

    // If no node is currently selected, select this one
    if (!selectedNode) {
      selectedNode = this;
      this.classList.add('selected');
    } 
    // If a node is already selected
    else {
      // Deselect if clicking the same node again
      if (selectedNode === this) {
        this.classList.remove('selected');
        selectedNode = null;
        return;
      }

      const color1 = selectedNode.dataset.color;
      const color2 = this.dataset.color;

      // Prevent connecting nodes on the same side
      if (selectedNode.parentNode === this.parentNode) {
        selectedNode.classList.remove('selected');
        selectedNode = this;
        this.classList.add('selected');
        return;
      }

      // Check if colors match
      if (color1 === color2) {
        // Success! Connect them.
        drawWire(selectedNode, this, color1);
        
        selectedNode.classList.remove('selected');
        selectedNode.classList.add('connected');
        this.classList.add('connected');
        
        selectedNode = null;
        connectionsMade++;

        if (connectionsMade === totalConnections) {
          triggerSystemBoot();
        }
      } else {
        // Mismatch - clear selection
        selectedNode.classList.remove('selected');
        selectedNode = null;
      }
    }
  });
});

// The sequence for when the puzzle is solved
function triggerSystemBoot() {
  instructionText.innerText = "SYSTEM ONLINE. BOOTING...";
  instructionText.style.color = "#fcd34d";
  
  // 1. Light up the bulb
  bulb.classList.add('glowing');

  // 2. Wait a moment, then flash the screen white
  setTimeout(() => {
    flashOverlay.style.opacity = '1';
    
    // 3. While screen is white, swap the displays
    setTimeout(() => {
      introScreen.style.display = 'none';
      portfolioScreen.style.display = 'block';
      
      // 4. Fade out the white flash to reveal portfolio
      flashOverlay.style.opacity = '0';
    }, 1000); // 1 second flash hold

  }, 800); // Wait 0.8s after bulb lights up
}