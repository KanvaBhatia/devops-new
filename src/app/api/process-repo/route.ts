import { NextResponse } from "next/server";
import axios from "axios";
var gh = require("parse-github-url");

export async function POST(request: Request) {
    const body = await request.json();
    const { git_url } = body;
    var repo_details = gh(git_url);
    if (
      repo_details == null ||
      repo_details.owner == null ||
      repo_details.name == null
    ) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const response = await axios.get(
      `https://api.github.com/repos/${repo_details.owner}/${repo_details.name}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      },
    );
    const { default_branch } = response.data;
    
    const gitUrl = `https://api.github.com/repos/${repo_details.owner}/${repo_details.name}/git/trees/${default_branch}`
  
    return gitUrl;
  }
  