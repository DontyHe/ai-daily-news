#!/usr/bin/env python3
"""
AI Daily News - GitHub仓库自动创建和部署脚本

使用方法:
1. 先创建GitHub Personal Access Token
2. 运行: python3 setup_github.py
3. 按提示输入token即可
"""

import os
import sys
import subprocess
import json
import time
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

# 配置
REPO_NAME = "ai-daily-news"
REPO_DESCRIPTION = "AI Daily News - 每日AI新闻网站"
GITHUB_USERNAME = "dontyhe13"
EMAIL = "dontyhe13@gmail.com"

def print_banner():
    print("""
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 AI Daily News - GitHub 部署助手                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    """)

def get_user_token():
    """获取用户输入的GitHub Token"""
    print("\n📋 创建GitHub Personal Access Token步骤:")
    print("=" * 60)
    print("1. 访问: https://github.com/settings/tokens")
    print("2. 点击: 'Generate new token (classic)'")
    print("3. 设置:")
    print("   • Note: 'AI Daily News Deployment'")
    print("   • Expiration: 建议选择 'No expiration'")
    print("   • 勾选以下权限:")
    print("     ✓ repo (完整控制私有仓库)")
    print("     ✓ workflow (工作流)")
    print("4. 点击 'Generate token'")
    print("5. 复制token (格式: ghp_xxxxxxxxxxxx)")
    print("=" * 60)

    token = input("\n🔑 请粘贴你的GitHub Personal Access Token: ").strip()

    if not token.startswith('ghp_') and not token.startswith('github_pat_'):
        print("\n⚠️  警告: Token格式可能不正确")
        print("正确格式应该以 'ghp_' 或 'github_pat_' 开头")

    return token

def validate_token(token):
    """验证Token是否有效"""
    print("\n🔍 验证Token...")

    try:
        url = "https://api.github.com/user"
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Python/AI-Daily-News-Setup"
        }

        req = Request(url, headers=headers)
        with urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            login = data.get('login', 'Unknown')

            if response.status == 200:
                print(f"✅ Token验证成功!")
                print(f"👤 登录用户: {login}")
                return True, login
            else:
                print(f"❌ 验证失败: {data.get('message', 'Unknown error')}")
                return False, None

    except HTTPError as e:
        print(f"❌ HTTP错误: {e.code} - {e.reason}")
        return False, None
    except URLError as e:
        print(f"❌ 网络错误: {e.reason}")
        return False, None
    except Exception as e:
        print(f"❌ 验证过程中出错: {str(e)}")
        return False, None

def create_github_repo(token, username):
    """创建GitHub仓库"""
    print(f"\n🏗️ 创建GitHub仓库: {REPO_NAME}")

    url = "https://api.github.com/user/repos"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Python/AI-Daily-News-Setup"
    }

    data = json.dumps({
        "name": REPO_NAME,
        "description": REPO_DESCRIPTION,
        "private": False,
        "auto_init": False,
        "license_template": "mit"
    }).encode('utf-8')

    try:
        req = Request(url, data=data, headers=headers, method='POST')

        with urlopen(req, timeout=30) as response:
            if response.status == 201:
                result = json.loads(response.read().decode())
                print(f"✅ 仓库创建成功!")
                print(f"   📦 仓库地址: {result['html_url']}")
                return True, result['html_url']
            else:
                error_data = json.loads(response.read().decode())
                if 'name' in error_data and 'already exists' in error_data['name'].lower():
                    print(f"⚠️  仓库已存在，跳过创建")
                    repo_url = f"https://github.com/{username}/{REPO_NAME}"
                    print(f"   📦 仓库地址: {repo_url}")
                    return True, repo_url
                else:
                    print(f"❌ 创建失败: {error_data.get('message', 'Unknown error')}")
                    return False, None

    except HTTPError as e:
        error_msg = json.loads(e.read().decode()).get('message', e.reason)
        print(f"❌ HTTP错误: {e.code} - {error_msg}")
        if e.code == 401:
            print("💡 提示: Token可能已过期或权限不足，请重新创建")
        return False, None
    except Exception as e:
        print(f"❌ 创建仓库时出错: {str(e)}")
        return False, None

def setup_git_repo():
    """设置本地Git仓库"""
    print("\n📝 配置本地Git仓库...")

    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')

    if not os.path.exists('.git'):
        subprocess.run(['git', 'init'], check=True)
        print("   ✓ Git仓库初始化完成")
    else:
        print("   ✓ Git仓库已存在")

    subprocess.run(['git', 'config', 'user.name', GITHUB_USERNAME], check=True)
    subprocess.run(['git', 'config', 'user.email', EMAIL], check=True)
    print("   ✓ Git用户配置完成")

    # 切换到main分支
    subprocess.run(['git', 'branch', '-M', 'main'], check=True)
    print("   ✓ 分支重命名为 main")

    return True

def commit_and_push(token, username, repo_url):
    """提交并推送到GitHub"""
    print("\n📤 提交代码到GitHub...")

    os.chdir(os.path.dirname(os.path.abspath(__file__)) or '.')

    try:
        # 添加所有文件
        subprocess.run(['git', 'add', '-A'], check=True)
        print("   ✓ 文件已添加到暂存区")

        # 检查是否有更改
        result = subprocess.run(
            ['git', 'status', '--porcelain'],
            capture_output=True,
            text=True
        )

        if not result.stdout.strip():
            print("   ⚠️  没有新文件需要提交")
        else:
            # 提交
            commit_msg = """✨ Initial commit: AI Daily News website

## 功能特性
- 📰 每日AI新闻模块
- 📚 最新论文展示
- 🛠️ AI工具推荐
- 🔍 搜索和筛选功能
- 🌙 深色模式支持
- 📱 响应式设计
- 🚀 Vercel部署配置

🤖 Generated by AI Daily News Setup Script
            """

            subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
            print("   ✓ 代码已提交")

        # 设置远程仓库URL（包含token用于认证）
        remote_url = repo_url.replace('https://', f'https://{username}:{token}@')
        subprocess.run(['git', 'remote', 'set-url', 'origin', remote_url], check=True)

        # 推送
        subprocess.run(['git', 'push', '-u', 'origin', 'main'], check=True, timeout=60)
        print("   ✓ 代码已推送到GitHub")

        return True

    except subprocess.CalledProcessError as e:
        print(f"   ❌ Git操作失败: {e}")
        return False
    except subprocess.TimeoutExpired:
        print("   ❌ 推送超时，请检查网络连接")
        return False

def generate_vercel_deploy_guide(repo_url):
    """生成Vercel部署指南"""
    print("\n" + "=" * 60)
    print("🎉 GitHub仓库创建并推送成功！")
    print("=" * 60)

    print(f"""
📦 你的GitHub仓库: {repo_url}

🚀 下一步：部署到Vercel

方法1: 通过Vercel Dashboard（推荐）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 访问: https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择仓库: {REPO_NAME}
4. 点击 "Deploy"

方法2: 通过Vercel CLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 安装CLI: npm i -g vercel
2. 登录: vercel login
3. 进入项目目录: cd ai-daily-news
4. 部署: vercel --prod

🌐 部署成功后，你的网站将上线:
   • GitHub Pages: https://dontyhe13.github.io/{REPO_NAME}/
   • Vercel: https://{REPO_NAME}-vercel.app
   • 自定义域名: 访问Vercel项目设置添加

📚 详细文档:
   • DEPLOYMENT_GUIDE.md - 完整部署指南
   • README.md - 项目使用说明

🐈‍⬛ 恭喜！AI Daily News已上线！

💡 提示: 每次推送到GitHub，Vercel会自动重新部署
    """)

def main():
    """主函数"""
    print_banner()

    # 检查是否已有token参数
    token = sys.argv[1] if len(sys.argv) > 1 else None

    if not token:
        token = get_user_token()

    if not token:
        print("\n❌ 需要提供GitHub Token才能继续")
        sys.exit(1)

    # 验证token
    success, login = validate_token(token)
    if not success:
        print("\n❌ Token验证失败，请重新获取Token后重试")
        sys.exit(1)

    # 设置本地Git仓库
    if not setup_git_repo():
        print("\n❌ Git仓库设置失败")
        sys.exit(1)

    # 创建GitHub仓库
    success, repo_url = create_github_repo(token, login or GITHUB_USERNAME)
    if not success:
        print("\n❌ GitHub仓库创建失败")
        sys.exit(1)

    # 提交并推送
    if not commit_and_push(token, GITHUB_USERNAME, repo_url):
        print("\n❌ 代码推送失败")
        sys.exit(1)

    # 生成部署指南
    generate_vercel_deploy_guide(repo_url)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 用户取消操作")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ 发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
