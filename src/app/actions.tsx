"use server";

import { streamUI } from "ai/rsc";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import axios from "axios";
var gh = require("parse-github-url");

const openai = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:
    "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",
});
const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return "82°F️ ☀️";
};

interface WeatherProps {
  location: string;
  weather: string;
}

const WeatherComponent = (props: WeatherProps) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather}
  </div>
);

const parseGitHubUrl = (url: string) => {
  var repo_details = gh(url);
  if (
    repo_details == null ||
    repo_details.owner == null ||
    repo_details.name == null
  ) {
    return { error: "Invalid URL" };
  }
  return repo_details;
};

export async function streamComponent(link: string) {
  const repo_details = parseGitHubUrl(link);
  if (repo_details.error) {
    return <div>{repo_details.error}</div>;
  }
  const gitResponse = await axios.get(
    `https://api.github.com/repos/${repo_details.owner}/${repo_details.name}`,
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  const { default_branch } = gitResponse.data;
  console.log({ default_branch });
  const defaultGitUrl = `https://api.github.com/repos/${repo_details.owner}/${repo_details.name}/git/trees/${default_branch}`;

  const gitData = await axios.get(defaultGitUrl, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const nodes = gitData?.data?.tree;
  const blobs = nodes?.filter((node: any) => node.type === "blob");
  console.log({ blobs });

  const fileNamesAndUrls = await Promise.all(
    blobs?.map((blob: any) => {
      if (blob.size < 10000) {
        return axios
          .get(blob.url, {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
          })
          .then((contentResp) => {
            const contentData = contentResp.data;
            const content = contentData.content;
            // base64 decode the content
            const decodedContent = Buffer.from(content, "base64").toString(
              "utf-8"
            );
            return {
              name: blob.path,
              url: blob.url,
              content: decodedContent,
            };
          });
      }
    })
  );

  console.log({ fileNamesAndUrls });

  // create a prompt like using the file content of the following files generate dockerfile and workflow.yml files

  const prompt = fileNamesAndUrls
    .map((file) => {
      if (!file) return;
      return `File: ${file.name}\nContent: ${file.content}`;
    })
    .join("\n");

  const result = await streamUI({
    model: openai("openai/gpt-4-32k"),
    prompt: `using the file content of the following files generate dockerfile and workflow.yml files\n\n${prompt}`,
    text: ({ content }) => <div>{content}</div>,
  });

  return result.value;
}
