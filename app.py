from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# ステータスの初期化
towers = [[], [], []]
num_disks = 3
move_count = 0

def init_game(disks):
    global towers, move_count
    towers = [[], [], []]
    for i in range(disks, 0, -1):
        towers[0].append(i)
    move_count = 0

# ルーティング設定
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start():
    global num_disks
    data = request.get_json()
    num_disks = data['num_disks']
    init_game(num_disks)
    return jsonify(success=True)

@app.route('/move', methods=['POST'])
def move():
    global move_count
    data = request.get_json()
    from_tower = data['from']
    to_tower = data['to']
    if len(towers[from_tower]) == 0 or (len(towers[to_tower]) > 0 and towers[from_tower][-1] > towers[to_tower][-1]):
        return jsonify(success=False)
    disk = towers[from_tower].pop()
    towers[to_tower].append(disk)
    move_count += 1
    return jsonify(success=True, move_count=move_count)

if __name__ == '__main__':
    init_game(num_disks)
    app.run(debug=True)
