#include <iostream>
#include <queue>
#include <stack>
#include <algorithm>
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

        currentVisitedList.push_back(node);

        // Create an image of the current status
        Step currentStep;
        currentStep.currentNode = node;
        currentStep.visitedNodes = currentVisitedList;

        // Add neighbors to queue
        if (adjList.find(node) != adjList.end())
            for (int neighbor : adjList.at(node))
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }

        std::queue<int> tempQ = q;
        while (!tempQ.empty()) {
            currentStep.dataStructure.push_back(tempQ.front());
            tempQ.pop();
        }

        stepsHistory.push_back(currentStep);

        q.pop();
    }

    return json{
        {"algorithm", "BFS"},
        {"startNode", startNode},
        {"steps", stepsHistory}
    };
}

json runDFS(int startNode, std::unordered_map<int, std::vector<int>> adjList) {
    std::vector<Step> stepsHistory;
    std::stack<int> s;
    std::unordered_map<int, bool> visited;

    s.push(startNode);

    std::vector<int> currentVisitedList;

    while (!s.empty()) {
        int node = s.top();
        s.pop();

        if (visited[node]) continue;

        visited[node] = true;
        currentVisitedList.push_back(node);

        // Create an image of the current status
        Step currentStep;
        currentStep.currentNode = node;
        currentStep.visitedNodes = currentVisitedList;

        // Add neighbors to stack
        if (adjList.find(node) != adjList.end()) {
            auto neighbors = adjList.at(node);
            // Reverse neighbors to traverse from smallest to biggest
            reverse(neighbors.begin(), neighbors.end());

            for (int neighbor : neighbors)
                if (!visited[neighbor]) {
                    s.push(neighbor);
                }
        }

        std::stack<int> tempS = s;
        while (!tempS.empty()) {
            currentStep.dataStructure.push_back(tempS.top());
            tempS.pop();
        }

        stepsHistory.push_back(currentStep);
    }

    return json{
        {"algorithm", "DFS"},
        {"startNode", startNode},
        {"steps", stepsHistory}
    };
}

int main() {
    httplib::Server svr;

    svr.Options("/api/algorithm", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 200;
        });

    svr.Post("/api/algorithm", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");

        try {
            json requestJson = json::parse(req.body);

            int startNode = requestJson["startNode"];
            std::string algorithm = requestJson["algorithm"];
            std::unordered_map<int, std::vector<int>> adjList;
            std::unordered_map<int, std::vector<std::pair<int, int>>> weightedAdjList;

            if (requestJson.contains("adjacencyList")) {
                for (auto& [keyStr, neighborsJson] : requestJson["adjacencyList"].items()) {
                    int node = std::stoi(keyStr);
                    for (auto& neighbor : neighborsJson) {
                        int to = neighbor["to"];
                        int weight = neighbor["weight"];

                        adjList[node].push_back(to);
                        weightedAdjList[node].push_back({ to, weight });
                    }
                }
            }
            json responseJson;
            if (algorithm == "BFS") {
                responseJson = runBFS(startNode, adjList);
            }
            else {
                responseJson = runDFS(startNode, adjList);
            }
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