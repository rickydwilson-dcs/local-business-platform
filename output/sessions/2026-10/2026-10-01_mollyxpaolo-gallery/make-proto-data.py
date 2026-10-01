"""Build prototype/data.js from the full manifest: the enhanced 10 plus an even sample per chapter.
Run: python3 make-proto-data.py ~/Downloads/mollyxpaolo-build/manifest.json"""
import json, sys, os
m = json.load(open(sys.argv[1]))
BASE = "https://pub-3029869edf074088a713eb0fbce05c35.r2.dev/"
CHAPTERS = [  # time ranges from the capture-time clusters; titles are placeholders for the family to rename
    {"id": "vows", "title": "The Vows", "kicker": "Chapter one", "from": "13:00", "to": "14:12", "blurb": "A gazebo, a garden wall, and everyone they love in folding chairs."},
    {"id": "fast-lane", "title": "Love in the Fast Lane", "kicker": "Chapter two", "from": "14:12", "to": "15:00", "blurb": "A white Cadillac, a neon heart, and the most famous sign in the desert."},
    {"id": "strip", "title": "On the Strip", "kicker": "Chapter three", "from": "15:00", "to": "15:39", "blurb": "Fountains at Caesars, the Eiffel Tower at Paris, and a hundred-degree afternoon."},
    {"id": "staircase", "title": "The Grand Staircase", "kicker": "Chapter four", "from": "15:39", "to": "23:59", "blurb": "Marble, chandeliers, and a staircase made for an entrance."},
]
PER_CHAPTER = 14
def hm(p): return p["takenAt"][11:16] if p["takenAt"] else "23:58"
photos = []
for c in CHAPTERS:
    inch = [p for p in m["photos"] if c["from"] <= hm(p) < c["to"]]
    plain = [p for p in inch if not p["enhanced"]]
    step = len(plain) / PER_CHAPTER
    pick = {plain[int(i * step)]["id"] for i in range(PER_CHAPTER)} | {p["id"] for p in inch if p["enhanced"]}
    for p in inch:
        if p["id"] in pick:
            photos.append({
                "id": p["id"], "n": p["number"], "w": p["width"], "h": p["height"], "t": hm(p) if p["takenAt"] else None,
                "chapter": c["id"], "featured": p["featured"], "enhanced": p["enhanced"],
                "ph": {k: v["placeholder"] for k, v in p["tones"].items()},
            })
data = {"base": BASE + m["pathToken"] + "/", "chapters": CHAPTERS, "photos": photos,
        "video": {"src": BASE + m["pathToken"] + "/video/mollyxpaolo-wedding-1080p.mp4", "poster": BASE + m["pathToken"] + "/video/poster.jpg"}}
out = os.path.join(os.path.dirname(__file__), "prototype", "data.js")
open(out, "w").write("window.MXP = " + json.dumps(data, separators=(",", ":")) + ";\n")
print(len(photos), "photos;", {c["id"]: sum(p["chapter"] == c["id"] for p in photos) for c in CHAPTERS}, os.path.getsize(out) // 1024, "KB")
