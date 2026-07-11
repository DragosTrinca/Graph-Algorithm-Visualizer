#include <iostream>
#include <queue>
#include <vector>
#include <unordered_map>
#include <string>
#pragma comment(lib, "Ws2_32.lib")
#include "httplib.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

struct Step {
    int currentNode;
    std::vector<int> visitedNodes;
    std::vector<int> dataStructure;
};

void to_json(json& j, const Step& s) {
    j = json{
        {"currentNode", s.currentNode},
        {"visitedNodes", s.visitedNodes},
        {"dataStructure", s.dataStructure}
    };
}

json runBFS(int startNode, std::unordered_map<int, std::vector<int>> adjList) {
    std::vector<Step> stepsHistory;
    std::queue<int> q;
    std::unordered_map<int, bool> visited;

    q.push(startNode);
    visited[startNode] = true;

    std::vector<int> currentVisitedList;

    while (!q.empty()) {
        int node = q.front();
        q.pop();

        currentVisitedList.push_back(node);

        // Create an image of the current status
        Step currentStep;
        currentStep.currentNode = node;
        currentStep.visitedNodes = currentVisitedList;

        std::queue<int> tempQ = q;
        while (!tempQ.empty()) {
            currentStep.dataStructure.push_back(tempQ.front());
            tempQ.pop();
        }

        stepsHistory.push_back(currentStep);

        // Add neighbors to queue
        if (adjList.find(node) != adjList.end())
            for (int neighbor : adjList.at(node))
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
    }

    return json{
        {"algorithm", "BFS"},
        {"startNode", startNode},
        {"steps", stepsHistory}
    };
}

int main() {
    httplib::Server svr;

    svr.Options("/api/bfs", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 200;
        });

    svr.Post("/api/bfs", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");

        try {
            json requestJson = json::parse(req.body);

            int startNode = requestJson["startNode"];
            std::unordered_map<int, std::vector<int>> adjList;

            if (requestJson.contains("adjacencyList")) {
                for (auto& [keyStr, neighborsJson] : requestJson["adjacencyList"].items()) {
                    int node = std::stoi(keyStr);
                    adjList[node] = neighborsJson.get<std::vector<int>>();
                }
            }

            json responseJson = runBFS(startNode, adjList);
            res.set_content(responseJson.dump(), "application/json");
        }
        catch (const std::exception& e) {
            res.status = 500;
            res.set_content(json{ {"error", e.what()} }.dump(), "application/json");
        }
        });

    std::cout << "[INFO] Backend is running. Listening on http://localhost:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);
    return 0;
}