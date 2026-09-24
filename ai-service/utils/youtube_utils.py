import subprocess
import re
import sys

def get_video_id(url):
    """
    Extracts the video ID from a YouTube URL.
    """
    regex = r"(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    return match.group(1) if match else None

def get_youtube_transcript(url):
    """
    Fetches the transcript for a given YouTube video URL using the CLI.
    Returns the transcript as a single string or an error message.
    """
    video_id = get_video_id(url)
    if not video_id:
        return "Error: Could not extract a valid YouTube Video ID from the link."

    try:
        # Use subprocess to call the CLI version which we verified works
        # --format text gives us just the words
        result = subprocess.run(
            [sys.executable, "-m", "youtube_transcript_api", video_id, "--format", "text"],
            capture_output=True,
            text=True,
            encoding='utf-8',
            check=True
        )
        
        full_transcript = result.stdout.strip()
        
        # Clean up whitespace/newlines into a single block
        full_transcript = " ".join(full_transcript.split())
        
        return full_transcript
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.strip() if e.stderr else str(e)
        return f"Error fetching transcript via CLI: {error_msg}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"
