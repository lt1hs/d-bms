<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|unique:users',
            'password' => 'required|min:6',
            'role' => 'required',
            'permissions' => 'nullable'
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'permissions' => isset($validated['permissions']) ? json_encode($validated['permissions']) : null,
        ]);

        return response()->json($user, 201);
    }

    public function destroy(User $user)
    {
        if ($user->role === 'SUPER_ADMIN') {
            return response()->json(['message' => 'Cannot delete Super Admin'], 403);
        }
        $user->delete();
        return response()->json(null, 204);
    }
}
