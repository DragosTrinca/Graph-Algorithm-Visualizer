package com.graph.backendjava.model;

import java.util.List;
import java.util.Map;

public record GraphRequest(
        int startNode,
        String algorithm,
        Map<Integer, List<Edge>> adjacencyList
) {
}
