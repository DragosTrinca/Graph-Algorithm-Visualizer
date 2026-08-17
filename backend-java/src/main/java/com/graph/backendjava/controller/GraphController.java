package com.graph.backendjava.controller;

import com.graph.backendjava.model.GraphRequest;
import com.graph.backendjava.model.GraphResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class GraphController {

    @PostMapping("api/algorithm")
    public GraphResponse processAlgorithm(@RequestBody GraphRequest request) {
        System.out.println("Received request: " + request.algorithm());

        // TO-DO add BFS/DFS/Dijkstra route logic

        return new GraphResponse(request.algorithm(), request.startNode(), List.of());
    }
}
