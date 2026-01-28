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
            'permissions' => 'nullable',
            'profile_image' => 'nullable|string'
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'permissions' => isset($validated['permissions']) ? json_encode($validated['permissions']) : null,
            'profile_image' => $validated['profile_image'] ?? null,
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'username' => ['required', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|min:6',
            'role' => 'required',
            'permissions' => 'nullable',
            'profile_image' => 'nullable'
        ]);

        $data = [
            'username' => $validated['username'],
            'role' => $validated['role'],
            'permissions' => isset($validated['permissions']) ? json_encode($validated['permissions']) : null,
            'profile_image' => $validated['profile_image'] ?? $user->profile_image,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);

        return response()->json($user);
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
