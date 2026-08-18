package com.graph.backendjava.controller;

import com.graph.backendjava.model.GraphRequest;
import com.graph.backendjava.model.GraphResponse;
import com.graph.backendjava.service.GraphService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @PostMapping("api/algorithm")
    public GraphResponse processAlgorithm(@RequestBody GraphRequest request) {
        if ("BFS".equalsIgnoreCase(request.algorithm())) {
            return graphService.runBFS(request.startNode(), request.adjacencyList());
        }
        else if ("DFS".equalsIgnoreCase(request.algorithm())) {
            return graphService.runDFS(request.startNode(), request.adjacencyList());
        }
        else if ("Dijkstra".equalsIgnoreCase(request.algorithm())) {
            return graphService.runDijkstra(request.startNode(), request.adjacencyList());
        }

        throw new IllegalArgumentException("Invalid request");
    }
}
