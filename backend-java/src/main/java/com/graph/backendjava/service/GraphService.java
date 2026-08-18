package com.graph.backendjava.service;

import com.graph.backendjava.model.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class GraphService {
    public GraphResponse runBFS(int startNode, Map<Integer, List<Edge>> adjList) {
        List<Step> stepsHistory = new ArrayList<>();
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        List<Integer> currentVisitedList = new ArrayList<>();

        queue.add(startNode);
        visited.add(startNode);

        while (!queue.isEmpty()) {
            int node = queue.peek();

            currentVisitedList.add(node);

            List<Edge> neighbors = adjList.getOrDefault(node, Collections.emptyList());
            for (Edge edge : neighbors) {
                int neighbor = edge.to();
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }

            List<Integer> queueSnapshot = new ArrayList<>(queue);
            stepsHistory.add(new Step(node, new ArrayList<>(currentVisitedList), queueSnapshot));
            queue.poll();
        }

        return new GraphResponse("BFS", startNode, stepsHistory);
    }
}
