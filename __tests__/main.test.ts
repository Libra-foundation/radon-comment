import {Wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import {expect, test} from '@jest/globals'

test('throws invalid number', async () => {
  const INPUT:number = parseInt('foo', 10)
  await expect(Wait(INPUT)).rejects.toThrow('milliseconds not a number')
})

test('wait 500 ms', async () => {
  const START:Date = new Date()
  await Wait(500)
  const END:Date = new Date()
  const DELTA:number = Math.abs(END.getTime() - START.getTime())
  expect(DELTA).toBeGreaterThan(450)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('runs', () => {
  process.env.INPUT_MILLISECONDS = '500'
  const NP:string = process.execPath
  const IP:string = path.join(__dirname, '..', 'lib', 'main.js')

  if (!fs.existsSync(IP)) {
    cp.execSync("npm run build")
  }
  
  const OPTIONS: cp.ExecFileSyncOptions = {
    env: process.env
  }
  
  const OUTPUT:string = cp.execFileSync(NP, [IP], OPTIONS).toString()

  expect(OUTPUT).toBeDefined()

})
