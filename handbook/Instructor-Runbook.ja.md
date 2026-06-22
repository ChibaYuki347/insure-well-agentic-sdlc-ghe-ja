# 講師用 進行台本（Instructor Runbook）

> **対象:** 10:30〜16:30 の日本語セッション（対面ハンズオン）の講師・ファシリテーター。
> **全体スケジュール:** [Agenda.ja.md](Agenda.ja.md) ・ **概念解説:** [guides/0.Concepts-Primer.ja.md](guides/0.Concepts-Primer.ja.md)
> **完全ガイド:** [Workshop-Guide.md](Workshop-Guide.md) ・ **デモ手順:** [guides/5.Demo-Flow.md](guides/5.Demo-Flow.md)

---

## 0. このワークショップの位置づけ（最初に参加者へ伝える）

- ゴールは「**新しい働き方の型を体感する**」こと。**全フェーズの完走は目的ではありません。**
- 参加者は**一行もコードを書きません**。エージェントが実装します。人は要件（What）に集中。
- 講師が画面で見せ、**参加者は並行して自分の環境で試す**。詰まったら現地サポートが助ける。
- 時間が来たら先へ進む。**環境は後日も使える**ので、続きは各自で実施可能。
- 「途中で失敗しても大丈夫」を繰り返し伝え、心理的安全性を確保する。

---

## 1. 役割分担

| 役割 | 担当 | 主な仕事 |
| --- | --- | --- |
| メイン講師 | 講師 | 画面共有・解説・デモ・進行 |
| 現地サポート | 2〜3名 | 個別の詰まり対応（PC を覗いて即修正）、MCP/PAT トラブル |
| タイムキーパー | サポートの1名 | 各フェーズの残り時間管理、巻き/延ばしの判断補助 |

> 対面なので、**サポート1人あたり 8〜10名程度**を目安に島を分担すると目が届きやすい。

---

## 2. 前日までの講師側チェックリスト

> ⚠️ **最重要:** 環境・権限（Org 配下リポジトリ／Copilot・GHAS 有効化／**Org スコープ PAT の管理者承認**）は
> 当日いちばん詰まる箇所です。**[setup/0.Organizer-Preflight.ja.md](setup/0.Organizer-Preflight.ja.md)（主催者/管理者
> 事前準備チェックリスト）を前日までに必ず消化**してください。特に **PAT 承認待ち**は進行を止めるので、
> 保険として**事前に Issue を中央作成**（`scripts/create-seed-issues.sh`）しておきます。

- [ ] **[主催者/管理者 事前準備](setup/0.Organizer-Preflight.ja.md) を完了**（Org リポジトリ／Copilot コーディングエージェント・コードレビュー／GHAS／**PAT 承認**／ブランチ保護）。
- [ ] お客様組織の**ワークショップ用リポジトリ**（運営担当提供・private・本リポジトリと約90%同一）にアクセスできる。
- [ ] 参加者へ**事前課題**（[setup/1.Prerequisites.ja.md](setup/1.Prerequisites.ja.md)）を周知済み。
- [ ] **正式な `.vscode/mcp.json`** と **社内プライベートレジストリ URL／認証手順**（運営担当提供）を入手済み。
      未入手ならテンプレ [setup/mcp.local.json](setup/mcp.local.json) で代替。
- [ ] **バックアップ資産**（§3）を準備済み。
- [ ] **GitHub Codespaces** の利用可否を運営／管理者に確認済み（ローカル構築で詰まった人の切り札）。利用可なら一度作成して動作確認。[guides/8.Codespaces.ja.md](guides/8.Codespaces.ja.md)
- [ ] 会場のネットワーク/プロキシで **社内プライベートレジストリへの到達**と **github.com への到達**を実機確認済み。
- [ ] 当日扱う **1機能（推奨: 認証）** の Issue 文面（タイトル・説明・受け入れ条件）を確定済み。
- [ ] **PAT 承認待ちの保険**として、Issue を**中央事前作成**済み（`scripts/create-seed-issues.sh`）。
- [ ] 投影用に概念プライマーの要点（BRD とは／MCP の原理・種類・スコープ）を手元に用意。
- [ ] **導線資料**を手元に: エージェント導線とゴール [guides/10.Agent-Flow-and-DoD.ja.md](guides/10.Agent-Flow-and-DoD.ja.md)／GHAS [guides/11.GHAS-Pipeline.ja.md](guides/11.GHAS-Pipeline.ja.md)／QA [guides/12.QA-Strategy.ja.md](guides/12.QA-Strategy.ja.md)。

---

## 3. 当日のバックアップ資産（“保険”）を用意しておく

直線的な依存（要件→実装→レビュー→…）で前段が失敗しても先に進めるよう、各段の**完成済みの状態**を
あらかじめ用意しておきます。これが当日の最大の安全網です。

> 🧰 **MCP が使えない時の代替経路は専用ページにまとめています:** [setup/4.MCP-Fallback.ja.md](setup/4.MCP-Fallback.ja.md)。
> MCP を使うのは「Issue 作成」と「Playwright 対話操作」だけで、どちらも非MCPの代替があります。

| 資産 | 中身 | いつ使うか |
| --- | --- | --- |
| **事前作成 Issue（具体物）** | [docs/seed-issues.md](../docs/seed-issues.md) の文面＋一括スクリプト [scripts/create-seed-issues.sh](../scripts/create-seed-issues.sh)（`gh`・repo 引数化）| MCP/同期で Issue 作成が詰まったら、これで即作成 |
| **同梱済み `.vscode/mcp.json`** | clone/Codespace 時点で配置済み（PAT は起動時入力）| 設定手順を省ける。運営提供版があれば上書き |
| **参照ブランチ `reference/auth-feature`** | 認証機能が実装済みの動く feature ブランチ | クラウドエージェントの PR が出ない/壊れている時に pull |
| **参照 PR（マージ前）** | レビュー対象として使える PR | コードレビュー/GHAS/QA の各デモを単独で見せたい時 |
| **テスト雛形 / 直接実行** | `src/frontend/tests/` ＋ `npm run test:e2e` 系 | Playwright MCP が不調でも UI 検証を成立させる |
| **スクリーンショット集** | `images/` の各工程画像 | デモが動かない時に「あるべき結果」を見せる |

> ポイント: **各フェーズは独立して“見せられる”状態**にしておく。前段の成果が無くても、
> 参照ブランチ/PR から始めれば、そのフェーズのデモは成立する。
> Issue 作成・委任・コーディング・レビュー・GHAS は **MCP 非依存**でも回せる（[4.MCP-Fallback.ja.md](setup/4.MCP-Fallback.ja.md)）。

---

## 4. フェーズ別 進行台本

各フェーズ: ⏱ 時間｜🎯 ねらい｜🎬 講師｜🙌 参加者｜💬 話すポイント｜⚠️ バックアップ。

### 10:00〜10:30 ｜ 前提 Office Hours（任意）
- 🎯 詰まっている人の救済。本編開始を遅らせない。
- 🎬 サポート中心で個別対応。インストール/PAT/MCP の最終確認。
- ⚠️ 多数が未完了なら、キックオフ冒頭5分を延長して全体で揃える。

### 10:30〜10:45 ｜ キックオフ + スモークチェック
- 🎯 全員の環境が「動く」ことを確認。心理的安全性の確保。
- 🎬 §0 のフレーミングを宣言 → `./run.sh` で起動確認、`curl` で 8080/3000 を確認。
- 🙌 各自アプリを起動し http://localhost:3000 を表示。
- 💬 「今日は完走が目的ではない／コードは書かない／詰まったら手を挙げて」。
- ⚠️ 起動しない人は**ペア席**へ。全員待たず、動いた人から次へ。

### 10:45〜11:20 ｜ 概念プライマー（★今回追加）
- 🎯 ハンズオン前に「何を・なぜ・どの仕組みで」を共有。
- 🎬 [guides/0.Concepts-Primer.ja.md](guides/0.Concepts-Primer.ja.md) に沿って解説:
  - Agentic SDLC 全体像（10分）
  - **BRD とは**（What/Why、[docs/BRD.md](../docs/BRD.md) を見せる）（8分）
  - **MCP とは**: 原理（ツール呼び出し）／種類（ローカル vs リモート）／**スコープ**（workspace/user/machine）（15分）
  - **社内制約: リモート MCP 禁止＝今日は全部ローカル**（2分）
- 💬 MCP の3スコープは「設定をどこに置くか＝適用範囲が変わる」と図で。今日は **workspace** 固定。
- ⚠️ 時間が押したら BRD と MCP を優先し、委任モードの細部は後のフェーズで実演に回す。

### 11:20〜11:45 ｜ MCP（ローカル）& エージェント
- 🎯 ローカル MCP を全員つなぐ。カスタムエージェントの呼び方を知る。
- 🎬 [setup/3.MCP-Local-Setup.ja.md](setup/3.MCP-Local-Setup.ja.md) に沿って:
  `.npmrc`(社内レジストリ) → `.vscode/mcp.json` 配置 → Reload → Tools に `github`/`browser_*` が出るか確認 → PAT 入力。
  続けて Copilot Chat で `@2.SDLC HLD Agent` 等の呼び出しを実演。
- 🙌 各自 MCP を設定し、ツールが見えることを確認。
- 💬 「`stdio`=ローカル起動。http/sse のリモート定義は使わない」。
- ⚠️ **MCP が繋がらない人**は止めずに進める。Issue 作成等は後段で **github.com の UI から直接**できる
  （§5 早見表）。社内レジストリ到達不可なら現地サポートが `.npmrc`/プロキシを確認。

### 11:45〜12:20 ｜ 要件 & 設計（HLD → BRD → バックログ）
- 🎯 既存アプリから優先度付きバックログを生成。
- 🎬 [guides/5.Demo-Flow.md](guides/5.Demo-Flow.md) Step1(HLD)→Step2(BRD)。HLD で設計、BRD でギャップ→バックログ。
- 🙌 各自エージェントを実行し、出力を眺める（完全一致でなくてOK）。
- 💬 「**入力（要件）が良ければ実装は安定**。だから要件にいちばん時間をかける」。
- 🆕 **任意: BRD をゼロから作る。** 時間に余裕がある回や「要件作成も体験したい」場合は、対話形式の
  `@0.SDLC BRD Author` にビジネスアイデア（[docs/brd-brief.example.md](../docs/brd-brief.example.md)）を渡して
  `docs/BRD.md` を新規作成 → 以降は通常フロー。手順 [guides/9.BRD-From-Scratch.ja.md](guides/9.BRD-From-Scratch.ja.md)。
  ※ 本編の時間が押している場合は**既定の用意済み BRD を使い**、これは宿題に回す。
- ⚠️ エージェント出力が乱れたら、**確定済みの [docs/BRD.md](../docs/BRD.md)** をそのまま使って次へ。

### 12:20〜12:35 ｜ Issue 作成（1機能に絞る）
- 🎯 当日扱う **1機能（推奨: 認証）** を GitHub Issue 化。
- 🎬 `@github` で Issue 作成（タイトル/説明/受け入れ条件/ラベル）。**スコープを認証1本に固定**と宣言。
- 🙌 各自 Issue を作成 or 既存の事前作成 Issue を確認。
- ⚠️ **MCP 同期/作成が失敗**したら、**事前作成済み Issue**（§3）or github.com UI で手動作成。ここで止めない。

### 12:35〜12:45 ｜ クラウドエージェントへ委任（昼直前）★重要タイミング
- 🎯 **昼休み前に**委任を着手し、**昼の間に非同期で走らせる**。
- 🎬 認証 Issue を **github.com 上で Copilot に割り当て**（または VS Code から委任）。「これから昼。裏で進みます」。
- 🙌 各自、選んだ Issue を委任して着手だけ済ませる。
- 💬 「クラウドエージェントの価値は非同期。待たずに昼へ」。**導線とゴールは [guides/10.Agent-Flow-and-DoD.ja.md](guides/10.Agent-Flow-and-DoD.ja.md) の1枚図で共有**。
- ⚠️ 委任が始まらない人がいても**昼へ進む**。午後、**参照ブランチ**から拾えるので問題なし。

### 12:45〜13:30 ｜ 昼食
- クラウドエージェントが裏で稼働。サポートは詰まっていた人の環境を昼の間に復旧。

### 13:30〜14:10 ｜ コーディング
- 🎯 生成 PR を確認し、ローカルエージェントで修正・拡張・反復。
- 🎬 **「クラウド→ローカルへの戻し方」を明示**: `gh pr checkout <PR番号>` → ローカルエージェントで補完 → `./run.sh` で確認 → push（[guides/10.Agent-Flow-and-DoD.ja.md](guides/10.Agent-Flow-and-DoD.ja.md)）。
- 🙌 各自の PR をローカルに取得して反復。
- 💬 **どこがゴールか**を都度確認（最小=Draft PR まで／本ゴール=承認してマージ）。DoD は [guides/10](guides/10.Agent-Flow-and-DoD.ja.md) §4。
- ⚠️ **PR が無い/壊れている人**は `git fetch && git checkout reference/auth-feature` で**参照ブランチ**に乗り換え、
  そこからレビュー以降を体験。「完璧な実装でなくてOK」。

### 14:10〜14:40 ｜ コードレビュー → マージ
- 🎯 Copilot 自動レビュー＋CodeQL＋人の承認 → マージ。
- 🎬 PR ページで **Copilot review** 実行 → 指摘に対し `@copilot` で batch fix / commit suggestion を実演 → 承認・マージ。
- 🙌 各自の PR（または参照 PR）でレビュー操作を体験。
- 💬 レビューの選択肢（fix / batch fix / ignore / `@copilot` 委任）を見せる。**ここがエージェント導線の到達点（マージ）**。
- ⚠️ CodeQL が遅い/未完了でも待たない。**参照 PR**でレビュー UI を見せれば成立。

### 14:40〜14:55 ｜ コーヒーブレイク

### 14:55〜15:25 ｜ GHAS（GitHub Advanced Security）
- 🎯 **パイプラインのどこで GHAS が効くか**を分解して見せる（[guides/11.GHAS-Pipeline.ja.md](guides/11.GHAS-Pipeline.ja.md) のチェックポイント図）。
- 🎬 PR を起点に **Code scanning(CodeQL)→Copilot Autofix→Secret scanning→Dependabot** の順で Security タブを解説。「検出→修正案→承認」を一度通す。
- 🙌 各自 Security タブを確認し、1 アラートをトリアージ（修正 or 理由付き dismiss or 課題化）。
- 💬 人=最終判断 / AI=検出・修正案、の分担（[guides/11](guides/11.GHAS-Pipeline.ja.md) §5）。
- ⚠️ 自分の repo にアラートが無ければ、**講師リポジトリ/参照 PR**の既知アラートを投影して解説。

### 15:25〜16:00 ｜ QA + Playwright
- 🎯 **「Playwright 本体 vs MCP」「人 vs AI」「操作結果がどう AI に渡るか」**を整理し、QA のゴールを共有（[guides/12.QA-Strategy.ja.md](guides/12.QA-Strategy.ja.md)）。
- 🎬 探索（MCP で対話的に触る）→ 判断（人）→ テスト生成（`@6.SDLC Test Agent`）→ 実行（`npm run test:e2e`）の順で実演。
  操作の**結果（snapshot/console/network/screenshot）が自動でエージェントに渡る**点を強調。
- 🙌 各自 1 シナリオを MCP で触り、（任意で）テスト 1 本を生成・実行。
- 💬 **人=意図・合否 / AI=操作・観測・生成**の境界（[guides/12](guides/12.QA-Strategy.ja.md) §3・§5）。
- ⚠️ Chromium 未導入なら `npx playwright install chromium`。MCP が不調なら **`npm run test:e2e`（本体）**で代替（[setup/4.MCP-Fallback.ja.md](setup/4.MCP-Fallback.ja.md) §4）。

### 16:00〜16:15 ｜ カスタムエージェント演習（★今回追加）
- 🎯 自分でエージェントを1つ作って呼び出す体験。
- 🎬 [guides/7.Custom-Agents-Exercise.ja.md](guides/7.Custom-Agents-Exercise.ja.md) を提示 → `/create-agent` or `.agent.md` 直書きを実演。
- 🙌 各自シナリオを1つ選び作成→ `@<name>` で呼び出し。数名に成果を発表してもらう。
- ⚠️ 作り切れなくてOK。「型」を掴めれば成功。続きは宿題。

### 16:15〜16:30 ｜ まとめ / バッファ / Q&A
- 🎯 学びの整理、次の一歩、トラブル吸収。
- 🎬 今日の流れを1枚で振り返り → よくある質問 → 「環境は後日も使える／宿題（ADO CI・演習続き）」を案内。
- 💬 1人1つ「明日から自分の業務で agent 化できそうなこと」を挙げてもらうと定着しやすい。

---

## 5. バックアップ早見表（フェーズ別フォールバック）

| 失敗箇所 | すぐ取れる代替 |
| --- | --- |
| 起動しない人がいる | **GitHub Codespaces** に切り替え（Java/Node/拡張がコンテナ同梱・全員同一環境）。[guides/8.Codespaces.ja.md](guides/8.Codespaces.ja.md) |
| MCP が繋がらない | [setup/4.MCP-Fallback.ja.md](setup/4.MCP-Fallback.ja.md) へ。Issue は **`gh`/Web UI**、委任は **github.com で割り当て**（MCP 不要）|
| 社内レジストリから `npx` できない | `.npmrc`・プロキシ・認証を現地サポートが確認。直らなければ Issue 作成は `gh`/UI で続行 |
| BRD/HLD 出力が崩れる | 確定済み [docs/BRD.md](../docs/BRD.md) / [docs/InsureWell_HLD.md](../docs/InsureWell_HLD.md) を使用 |
| Issue 作成が失敗 | **`scripts/create-seed-issues.sh --repo <owner>/<name>`** で一括作成（文面: [docs/seed-issues.md](../docs/seed-issues.md)）|
| クラウド PR が出ない/壊れ | `reference/auth-feature` **参照ブランチ**を pull してレビュー以降を体験 |
| CodeQL/CI が遅い・落ちる | 待たない。**参照 PR**でレビュー UI を投影。CI 検証は宿題（ADO は任意） |
| GHAS アラートが無い | 講師リポジトリ/参照 PR の既知アラートを投影 |
| Playwright(MCP) が動かない | `npx playwright install chromium`／**`npm run test:e2e` を直接実行**（[4.MCP-Fallback.ja.md](setup/4.MCP-Fallback.ja.md) §4）|
| 全体が押している | 巻き対象は GHAS と QA の解説尺。**委任(昼前)** と **概念プライマー**は死守 |

---

## 6. タイムマネジメントの原則

- **死守する2点:** ①昼直前(12:35〜)の**委任着手** ②序盤の**概念プライマー**（今回の主目的）。
- **巻ける所:** GHAS・QA の解説尺、コードレビューの反復回数。
- 各フェーズ終了2分前にタイムキーパーが合図。**待たずに進む**を徹底。
- 「ここで詰まっても後で取り戻せる（参照ブランチがある）」を口癖に。

---

## 7. ファシリテーションのコツ

- 対面ハンズオン。**島ごとにサポートを固定**し、手挙げに即応。
- 画面は**大きめのフォント**＋ゆっくり。操作の前に「今から何をするか」を一言。
- AI 出力は毎回変わる。**完全一致を期待しない**ことを最初に共有。
- 失敗を見せ札にする（「こうなったらこう直す」）と学びが深い。
- 専門用語は概念プライマーの言い回しに揃える（BRD／ローカル MCP／スコープ）。

---

## 8. 関連ドキュメント

- アジェンダ: [Agenda.ja.md](Agenda.ja.md) / [Agenda.md](Agenda.md) / [改訂理由](Agenda-Revision.md)
- **主催者/管理者 事前準備（最重要）: [setup/0.Organizer-Preflight.ja.md](setup/0.Organizer-Preflight.ja.md)**
- 概念: [guides/0.Concepts-Primer.ja.md](guides/0.Concepts-Primer.ja.md)
- **BRD をゼロから作る（任意）: [guides/9.BRD-From-Scratch.ja.md](guides/9.BRD-From-Scratch.ja.md) / [../docs/brd-brief.example.md](../docs/brd-brief.example.md)**
- 事前課題: [setup/1.Prerequisites.ja.md](setup/1.Prerequisites.ja.md)
- ローカル MCP: [setup/3.MCP-Local-Setup.ja.md](setup/3.MCP-Local-Setup.ja.md) / [setup/mcp.local.json](setup/mcp.local.json)
- **MCP フォールバック: [setup/4.MCP-Fallback.ja.md](setup/4.MCP-Fallback.ja.md)**
- **事前作成Issue: [../docs/seed-issues.md](../docs/seed-issues.md) / [../scripts/create-seed-issues.sh](../scripts/create-seed-issues.sh)**
- **エージェント導線＆完了の定義: [guides/10.Agent-Flow-and-DoD.ja.md](guides/10.Agent-Flow-and-DoD.ja.md)**
- **GHAS パイプライン: [guides/11.GHAS-Pipeline.ja.md](guides/11.GHAS-Pipeline.ja.md)**
- **QA 戦略（Playwright×MCP×人/AI）: [guides/12.QA-Strategy.ja.md](guides/12.QA-Strategy.ja.md)**
- Codespaces: [guides/8.Codespaces.ja.md](guides/8.Codespaces.ja.md)
- デモ手順: [guides/5.Demo-Flow.md](guides/5.Demo-Flow.md)
- Playwright: [guides/6.playwright-mcp-setup-working.md](guides/6.playwright-mcp-setup-working.md)
- カスタムエージェント演習: [guides/7.Custom-Agents-Exercise.ja.md](guides/7.Custom-Agents-Exercise.ja.md)
