package com.graph.backendjava.model;

import java.util.List;

public record GraphResponse(
        String algorithm,
        int startNode,
        List<Step> steps
) {
}
