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

    public GraphResponse runDFS(int startNode, Map<Integer, List<Edge>> adjList) {
        List<Step> stepsHistory = new ArrayList<>();
        Deque<Integer> stack = new ArrayDeque<>();
        Set<Integer> visited = new HashSet<>();
        List<Integer> currentVisitedList = new ArrayList<>();

        stack.push(startNode);

        while (!stack.isEmpty()) {
            int node = stack.pop();

            if (visited.contains(node)) continue;

            visited.add(node);
            currentVisitedList.add(node);

            List<Edge> neighbors = new ArrayList<>(adjList.getOrDefault(node, Collections.emptyList()));

            Collections.reverse(neighbors);

            for (Edge edge : neighbors) {
                int neighbor = edge.to();
                if (!visited.contains(neighbor)) {
                    stack.push(neighbor);
                }
            }

            List<Integer> stackSnapshot = new ArrayList<>(stack);

            stepsHistory.add(new Step(node, new ArrayList<>(currentVisitedList), stackSnapshot));
        }

        return new GraphResponse("DFS", startNode, stepsHistory);
    }

    public GraphResponse runDijkstra(int startNode, Map<Integer, List<Edge>> adjList) {
        List<Step> stepsHistory = new ArrayList<>();
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        Map<Integer, Integer> distances = new HashMap<>();
        Set<Integer> visited = new HashSet<>();
        List<Integer> currentVisitedList = new ArrayList<>();

        for (Integer node : adjList.keySet()) {
            distances.put(node, Integer.MAX_VALUE);
        }
        distances.put(startNode, 0);

        pq.add(new int[]{0, startNode});
        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int node = current[1];

            if (visited.contains(node)) continue;

            visited.add(node);
            currentVisitedList.add(node);

            List<Edge> neighbors = adjList.getOrDefault(node, Collections.emptyList());
            for (Edge edge : neighbors) {
                int neighbor = edge.to();
                int weight = edge.weight();

                int currentNeighborDist =  distances.getOrDefault(neighbor, Integer.MAX_VALUE);

                if (!visited.contains(neighbor) && distances.get(node) + weight < currentNeighborDist) {
                    distances.put(neighbor, distances.get(node) + weight);
                    pq.add(new int[]{distances.get(neighbor), neighbor});
                }
            }

            List<Integer> pqSnapshot = new ArrayList<>();
            PriorityQueue<int[]> tempPq = new PriorityQueue<>(pq);
            while (!tempPq.isEmpty()) {
                pqSnapshot.add(tempPq.poll()[1]);
            }

            stepsHistory.add(new Step(node, new ArrayList<>(currentVisitedList), pqSnapshot));
        }

        return new GraphResponse("Dijkstra", startNode, stepsHistory);
    }
}
