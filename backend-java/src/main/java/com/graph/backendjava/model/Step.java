package com.graph.backendjava.model;

import java.util.List;

public record Step(
        int currentNode,
        List<Integer> visitedNodes,
        List<Integer> dataStructure
) {
}
