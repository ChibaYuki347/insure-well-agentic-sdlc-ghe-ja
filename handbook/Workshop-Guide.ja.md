# InsureWell — ワークショップガイド

> **ワークショップ全体を通じた唯一の参照資料です。** セクションを順番に進めてください。各セクションには、詳細が必要な場合のより深いガイドへのリンクが含まれています。

---

## 目次

1. [このワークショップとは？](#1-このワークショップとは)
2. [前提条件](#2-前提条件)
3. [クローン・ビルド・アプリ起動](#3-クローンビルドアプリ起動)
4. [MCPサーバーのセットアップ](#4-mcpサーバーのセットアップ)
5. [エージェント委譲モード](#5-エージェント委譲モード)
6. [カスタムエージェント](#6-カスタムエージェント)
7. [デモフロー — ステップバイステップ](#7-デモフロー--ステップバイステップ)
8. [Playwright MCPワークショップ](#8-playwright-mcpワークショップ)
9. [GHASセットアップレビュー](#9-ghasセットアップレビュー)
10. [参考リンク](#10-参考リンク)

---

## 1. このワークショップとは？

このワークショップでは、**GitHub Copilotエージェント**を使って、**InsureWell**と呼ばれる実際のReact + Spring Bootアプリケーションにおいて、要件定義からコーディング、テスト、コードレビューまで、ソフトウェア開発のすべてのフェーズを自動化する方法を学びます。

**この場でできること：**

- フルスタックWebアプリをノートPCで起動する
- Model Context Protocol（MCP）を介してAIエージェントをGitHubに接続する
- 専門化されたエージェント（BRD、HLD、Dev、QA）を使って要件定義、設計、コード、テストを生成する
- AIが生成したプルリクエストをレビューしてマージする

[ワークフローを理解する](guides/3.Understand_Workflow.md)（ビジュアル）

[↑ 目次に戻る](#目次)

---

## 2. 前提条件

セッション開始**前に**[前提条件チェックリスト](setup/1.Prerequisites.ja.md)を完了してください。

**クイックサマリー — 必要なもの：**

| 要件 | バージョン |
|---|---|
| Java (JDK) | 17以上 |
| Maven | 3.9以上 |
| Node.js | 18以上 |
| npm | 9以上 |
| VS Code | 最新版 |
| GitHub Copilot + Chat拡張機能 | 最新版 |
| Git | 設定済み（`user.name`、`user.email`） |

**ターミナルで確認：**

```bash
java --version        # 17以上
mvn --version         # 3.9以上
node --version        # 18以上
npm --version         # 9以上
```

**必須のVS Code拡張機能**（マーケットプレイス `Cmd+Shift+X` からインストール）：

- GitHub Copilot Chat
- GitHub Pull Requests
- Extension Pack for Java
- Spring Boot Extension Pack
- ES7+ React/Redux/React-Native snippets

> **拡張機能に関するメモ（2025年）：** `GitHub Copilot` は単体ではインストールされなくなりました — **`GitHub Copilot Chat`** をインストールすると `GitHub Copilot` 拡張機能も自動的に含まれます（統合済み）。**`GitHub Pull Requests`** は `GitHub Pull Requests and Issues` の改名版です。Issue機能は引き続き含まれています。

**アカウントとアクセス：**

- Copilotサブスクリプションを持つGitHub Enterprise組織
- GitHub PAT（スコープ：`repo`、`read:org`、`workflow`）
- *（オプション）* Azure DevOps PAT — ADO統合セグメントでのみ必要

> **前提条件で詰まった場合は？** GitHub PATの作成方法を含むステップバイステップの説明は[詳細な前提条件ガイド](setup/1.Prerequisites.ja.md)をご覧ください。

[↑ 目次に戻る](#目次)

---

## 3. クローン・ビルド・アプリ起動

> **なぜこのステップが必要か？** エージェントがアプリケーションと対話し、生成されたコードの結果を確認するために、アプリケーションが起動している必要があります。

> 🚀 **ローカルインストール不要にしたい場合は？** **GitHub Codespaces** を使用してください — Java 17、Maven、Node、必要なVS Code拡張機能が自動的にプロビジョニングされます。[Codespacesガイド（JA）](guides/8.Codespaces.ja.md)をご覧ください。その後、下記の `./run.sh` にスキップしてください。

### クイックスタート

```bash
git clone https://github.com/im-naga-ghas/insure-well-agentic-sdlc-ghe.git
cd insure-well-agentic-sdlc-ghe/src
chmod +x run.sh
./run.sh
```

ブラウザで **http://localhost:3000** を開いてください。InsureWellのダッシュボードが表示されるはずです。

> **起動したもの：**
> - **バックエンド**（`http://localhost:8080/api`） — サンプルのポリシーと請求データをシードしたインメモリH2データベースを持つSpring Boot REST API
> - **フロントエンド**（`http://localhost:3000`） — バックエンドAPIを呼び出すReact Webアプリ

### 手動起動（スクリプトが動作しない場合）

```bash
# ターミナル 1 — バックエンド
cd src/backend
./mvnw spring-boot:run

# ターミナル 2 — フロントエンド
cd src/frontend
npm install   # 初回のみ
npm start
```

### 両サービスの起動確認

```bash
curl http://localhost:8080/api/policies   # ポリシーのJSON配列が返ってくるはず
curl http://localhost:3000                # HTMLページが返ってくるはず
```

[↑ 目次に戻る](#目次)

---

## 4. MCPサーバーのセットアップ

> **MCPとは何か？** Model Context Protocol（MCP）は、CopilotエージェントにGitHubやPlaywrightなどの外部サービスへの直接的な構造化アクセスを提供します。MCPなしでは、CopilotはファイルのReadとWriteしかできませんが、MCPがあればIssueの作成、PRのオープン、ブラウザのナビゲーションなどができます。

> ⚠️ **このセッションはローカル専用です。** 組織のポリシーにより**リモートMCPは禁止**されています。すべてのMCPは `.vscode/mcp.json` + `npx` を介してローカルで実行され、**プライベート**レジストリ（ワークスペーススコープ）から取得します。[setup/3.MCP-Local-Setup.ja.md](setup/3.MCP-Local-Setup.ja.md)（JA）および[guides/0.Concepts-Primer.ja.md](guides/0.Concepts-Primer.ja.md) §3のコンセプトを参照してください。UIベースの「サーバーを追加」オプションは制限のない環境では問題ありませんが、このセッションではローカルの `.vscode/mcp.json` テンプレート（[setup/mcp.local.json](setup/mcp.local.json)）を使用してください。

### GitHub MCPサーバー

**オプションA — VS Code UI使用（初心者に推奨）：**

1. VS Codeコマンドパレットを開く（`Cmd+Shift+P` / `Ctrl+Shift+P`）。
2. **「MCP: Add Server」** と入力して選択する。
3. リストから **GitHub** を選択する。
4. プロンプトが表示されたら、GitHubのPAT（前提条件ステップで取得済み）を入力する。
5. ステータスバーの緑色のインジケーターがサーバーの起動を確認する。

**オプションB — `.vscode/mcp.json` に手動で追加：**

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "github-pat",
      "description": "GitHub Personal Access Token",
      "password": true
    }
  ],
  "servers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${input:github-pat}"
      }
    }
  }
}
```

> **ヒント：** `${input:github-pat}` を使用することで、VS Codeはサーバー起動時にPATの入力を求めます — トークンはファイルに保存されません。

### Playwright MCPサーバー（ブラウザテスト用）

Playwright MCPサーバーはすでに `.vscode/mcp.json` に事前設定されています。動作確認するには：

1. Copilot Chatを開く。
2. チャット入力バーの**Tools**（プラグアイコン）をクリックする。
3. リストに `browser_*` ツールが表示されることを確認する。

PlaywrightのChromiumブラウザをインストールする必要がある場合：

```bash
npx playwright install chromium
```

### Azure DevOps MCPサーバー *（オプション）*

ADO統合セグメントでのみ必要です。手順については[Azure DevOps MCPセットアップ](https://github.com/mcp/microsoft/azure-devops-mcp)を参照し、ADOとGitHubの接続については[2.Azure-DevOps-Setup.md](setup/2.Azure-DevOps-Setup.md)を参照してください。

[↑ 目次に戻る](#目次)

---

## 5. エージェント委譲モード

作業方法に応じて適切なモードを選択してください：

| モード | いつ使うか | 動作方法 |
|---|---|---|
| **ローカルエージェント**（VS CodeのAgentモード） | インタラクティブなコーディング、デバッグ、リファクタリング | ワークスペース、ターミナル、未コミットの変更を確認し、すべてのステップを制御する |
| **クラウドエージェント**（VS Codeから） | コーディング中の非同期タスクの引き渡し | Copilotがバックグラウンドで作業し、結果がPRとして表示される |
| **GitHub Issue → Copilot** | 追跡されたバックログ作業 | GitHubでIssueをCopilotに割り当て、Issue説明が実装を駆動する |

**目安：** ローカル = インタラクティブ、即時。クラウド = オフロード、非同期。GitHub Issue = 追跡、チーム。

> 詳細な例と判断ガイドは[Copilotエージェント委譲ガイド](guides/4.Copilot-Agent-Delegation-Guide.md)をご覧ください。

[↑ 目次に戻る](#目次)

---

## 6. カスタムエージェント

> **カスタムエージェントとは？** カスタムエージェントは `.github/agents/` 内の `.agent.md` ファイルです。各エージェントはチームのスペシャリストのように特定の役割を持ち、専用の指示が設定されています。Copilot Chatで名前で呼び出せます。

| エージェント | 役割 |
|---|---|
| `0.SDLC BRD Author` | *（オプション、インタビュー優先）* ビジネスアイデアからBRDを作成 |
| `1.SDLC BRD Agent` | ビジネス要件 — BRD、エピック、フィーチャー |
| `2.SDLC HLD Agent` | 高レベル設計 — アーキテクチャ、コンポーネント境界、データフロー |
| `5.SDLC Dev Agent` | フィーチャー実装 — React + Spring Boot |
| `6.SDLC Test Agent` | テスト生成、CIトリアージ、カバレッジ |

**エージェントの呼び出し方：**

1. **Agentモード**でCopilot Chatを開く。
2. `@` の後にエージェント名を入力する（例：`@2.SDLC HLD Agent`）。
3. エージェント名の後にプロンプトを入力する。

**新しいエージェントの作成方法：**

```
/create-agent
```

または `.github/agents/` 配下に直接 `.agent.md` ファイルを追加する。

[↑ 目次に戻る](#目次)

---

## 7. デモフロー — ステップバイステップ

ワークショップ中はこれらのステップを順番に進めてください。

### ステップ1 — 高レベル設計の生成

Copilot Chat（Agentモード）で：

```
@2.SDLC HLD Agent InsureWellの高レベル設計を生成してください。
含めるもの：コンポーネント図、ReactフロントエンドとSpring Boot REST APIの間のデータフロー、
JPAパーシステンスレイヤー、請求の提出/更新APIサーフェス。
```

**期待する結果：** アーキテクチャ概要、コンポーネント相互作用図、APIサーフェスマップ。

---

### ステップ2 — 要件の生成

```
@1.SDLC BRD Agent InsureWellアプリケーション（src/backend、src/frontend、README.md）を分析してください。
ギャップを特定し、ビジネス要件、エピック、フィーチャーの優先順位付きバックログを作成してください。
```

**期待する結果：** 既存機能のリストと新機能の優先順位付きバックログ。

---

### ステップ3 — GitHubのIssueを作成する

```
@github 以下のユーザーストーリーのGitHub Issueを
im-naga-ghas/insure-well-agentic-sdlc-gheにラベル（enhancement、frontend、backend）付きで作成してください：
[ステップ2の出力からストーリーリストを貼り付ける]
```

**期待する結果：** GitHubリポジトリに新しいIssueが作成され、チーム全体に見える状態になる。

---

### ステップ4 — フィーチャーの実装

```
@5.SDLC Dev Agent InsureWellにユーザー認証を実装してください。
- バックエンドにSpring Securityログイン
- JPA/H2のUsersモデル
- Reactのサインイン/サインアウトフロー
- 認証の背後に請求とポリシーアクションを保護
- デフォルトの管理者ユーザーをシード
- バックエンドとフロントエンドのテストを追加
```

**期待する結果：** フィーチャーブランチと実装を含むプルリクエスト。

---

### ステップ5 — テストの追加

```
@6.SDLC Test Agent 認証フィーチャーのPRをレビューしてください。
ログイン成功/失敗、保護されたルート、ログアウト動作をカバーするテストを生成してください。
```

**期待する結果：** 新機能をカバーするテストファイルがPRに追加される。

---

### ステップ6 — レビューとマージ

PRページの**「Copilot review」**をクリックしてCopilotの組み込みコードレビューを使用するか、レビューエージェントを呼び出す。人間の承認後にマージする。

---

### フルサイクルのまとめ

```
クローン＆起動 → MCPセットアップ → カスタムエージェント
  → HLDエージェント → BRDエージェント → Issueの作成
  → Dev/クラウドエージェント → QAエージェント → レビュー → マージ
  → 次のストーリーへ繰り返す
```

---

### ステップ7 — パイプラインのステータスを確認する

AzDoパイプラインが起動したかどうかを確認する（PRの作成時にCIパイプラインがトリガーされるはず）

---

> 各ステップの正確なプロンプトと期待される出力を含む詳細なウォークスルーは、[デモフローガイド](guides/5.Demo-Flow.md)をご覧ください。

[↑ 目次に戻る](#目次)

---

## 8. Playwright MCPワークショップ

> **これは何か？** アプリが起動したら、Playwright MCPブラウザーツールを使ってCopilot ChatからインタラクティブにUI動作を検証できます — 最初にテストコードを書く必要はありません。

**利用可能なツールカテゴリ：**

| カテゴリ | ツール |
|---|---|
| ナビゲーション | `browser_navigate`、`browser_navigate_back`、`browser_resize`、`browser_close` |
| インタラクション | `browser_click`、`browser_fill_form`、`browser_type`、`browser_select_option` |
| インスペクション | `browser_snapshot`、`browser_take_screenshot`、`browser_evaluate` |

**必ず `data-testid` セレクターを使用してください** — 例：`[data-testid='add-policy-btn']`

**ワークショップフロー：**

1. アプリを起動する（バックエンドポート8080 + フロントエンドポート3000）
2. `browser_navigate` + `browser_snapshot` でナビゲーションのスモークテストを行う
3. ダッシュボード：ポリシータブをクリック、ポリシー追加モーダルを開いて入力・保存する
4. 請求：Claimsに移動し、新しい請求を提出、フィルター、ステータスを更新する

> 完全なセレクターリファレンス、すべてのツール名、ガイド付き演習は[Playwright MCPセットアップガイド](guides/6.playwright-mcp-setup-working.md)をご覧ください。

[↑ 目次に戻る](#目次)

---

## 9. GHASセットアップレビュー

1. AIが生成したセキュリティ検出結果をレビューしてトリアージする。
2. Dependabotの脆弱性アラートをレビューして修正する。
3. シークレットスキャンのアラートをレビューして、公開されたクレデンシャルをローテーションする。

> **GHASはパイプラインのどこに位置するか？** チェックポイント図とステップバイステップのトリアージは[GHASパイプラインガイド（JA）](guides/11.GHAS-Pipeline.ja.md)をご覧ください。

[↑ 目次に戻る](#目次)

---

## 10. 参考リンク

| リソース | リンク |
|---|---|
| GitHub MCPサーバー | https://github.com/modelcontextprotocol/servers/tree/main/src/github |
| VS Code Copilot Agentモード | https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode |
| Copilotカスタム指示 | https://code.visualstudio.com/docs/copilot/copilot-customization |
| Microsoft Playwright MCP | https://github.com/microsoft/playwright-mcp |
| InsureWell REST API | ../src/README.md |
| InsureWellデータモデル | ../docs/InsureWell_DataModel.md |
| InsureWell HLD | ../docs/InsureWell_HLD.md |
| 前提条件（詳細） | setup/1.Prerequisites.ja.md |
| Azure DevOpsセットアップ | setup/2.Azure-DevOps-Setup.md |
| ワークフロービジュアルガイド | guides/3.Understand_Workflow.md |
| エージェント委譲ガイド | guides/4.Copilot-Agent-Delegation-Guide.md |
| デモフロー（詳細） | guides/5.Demo-Flow.md |
| Playwright MCPガイド | guides/6.playwright-mcp-setup-working.md |
| オーガナイザー/管理者プレフライト（JA） | setup/0.Organizer-Preflight.ja.md |
| エージェントフローと完了定義（JA） | guides/10.Agent-Flow-and-DoD.ja.md |
| GHASパイプライン（JA） | guides/11.GHAS-Pipeline.ja.md |
| QA戦略 — Playwright × MCP × ヒューマン/AI（JA） | guides/12.QA-Strategy.ja.md |

[↑ 目次に戻る](#目次)
