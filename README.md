# Graph Algorithm Visualizer

<div align="center">
  <img src="https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++" />
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
</div>

> A full-stack interactive web application for visualizing graph traversal and pathfinding algorithms. The project features dual backend options (a C++ backend for high-performance algorithm execution and a modern Java/Spring Boot alternative) and a React-based frontend for interactive, step-by-step graphical visualization.

<img width="1210" height="783" alt="image" src="https://github.com/user-attachments/assets/e704702f-9cb3-45cc-b1e3-4089e1efde72" />

## Features
* **Algorithms Supported**: Breadth-First Search (BFS), Depth-First Search (DFS), and Dijkstra's Algorithm.
* **Interactive Canvas**: Drag and drop nodes to organize the graph layout dynamically.
* **Custom Graph Input**: Easily create graphs using a simple text-based edge list.
* **Graph Types**: Support for directed and undirected edges, as well as weighted edges for Dijkstra.
* **Animation Controls**: Auto-play, adjust speed, or manually step through the algorithm execution.
* **Data Structure Panel**: Real-time view of the internal data structure (Queue for BFS, Stack for DFS, Priority Queue for Dijkstra).

## Prerequisites
* **C++ Backend**: C++ Compiler (C++17 recommended).
* **Java Backend**: Java Development Kit (JDK 17 or higher) and Maven.
* **Frontend**: Node.js and npm (for the React application).

## Step-by-Step Installation

### 1. Backend Setup
You can choose to run either the C++ or the Java backend. Both expose the exact same API and run on port 8080.

#### Option A: C++ Backend
1. Ensure you have a modern C++ compiler installed.
2. Compile the backend server (core.cpp).
3. Run the compiled executable. The backend will start listening on `http://0.0.0.0:8080`.

#### Option B: Java Backend (Spring Boot)
1. Open the Java backend project folder in your preferred IDE (e.g., IntelliJ IDEA).
2. Allow Maven to download the required dependencies (Spring Web).
3. Run the `BackendApplication.java` main class.
4. The Tomcat server will start automatically on `http://localhost:8080`.

### 2. Frontend Setup (React)
1. Navigate to the frontend directory.
   ```bash
   cd graph-frontend
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server using Vite:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local React server URL.

## How to Use
1. **Create the Graph**: Use the sidebar's Graph Editor to define edges. Toggle checkboxes for Directed or Show Weights as needed.
2. **Apply Graph**: The graph renders on the canvas upon applying. Drag nodes with your mouse to reposition them for better visibility.
3. **Select Algorithm**: Choose between BFS, DFS, or Dijkstra from the Algorithm Controls, and define a Start Node.
4. **Visualize**: Once you start the algorithm, the frontend sends a JSON payload with the adjacency list to the backend API at `http://localhost:8080/api/algorithm`.
5. **Control Animation**: Use the Play/Pause, Next step, and Previous step buttons to navigate through the algorithm's execution history.

## API Architecture
The frontend and backend communicate via a simple REST API. 
* **Endpoint**: `POST /api/algorithm`
* **Request Payload**: JSON containing `algorithm` name, `startNode`, and `adjacencyList` (which includes targets and weights).
* **Response**: A JSON object containing the ordered sequence of steps, where each step includes the `currentNode`, `visitedNodes`, and the current state of the `dataStructure`.

## Future Improvements (TODO)
* **Additional Algorithms**: Implement more graph algorithms such as A* Search (pathfinding), Bellman-Ford (handling negative weights), and Kruskal's or Prim's for Minimum Spanning Trees (MST).
* **Save & Export Functionality**: Add features to save custom graph layouts locally (via LocalStorage) or export them as JSON and PNG/SVG files.
